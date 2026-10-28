/**
 * Local-only persistence. Nothing here leaves the device.
 * - IndexedDB: practice sessions and per-question attempts.
 * - localStorage (guarded): small preferences, visit-prep checklist, active quiz session.
 */
import { CONTENT_VERSION } from '@/content';

export const DB_NAME = 'menopause-compass';
const DB_VERSION = 1;
export const EXPORT_SCHEMA_VERSION = 1;

export type PracticeMode = 'practice' | 'timed' | 'weak' | 'demo';

export interface Attempt {
  id: string; // `${sessionId}:${questionId}`
  sessionId: string;
  createdAt: string;
  mode: PracticeMode;
  questionId: string;
  selectedId: string | null;
  correct: boolean;
  durationSeconds: number;
  flagged: boolean;
  moduleTags: string[];
  contentVersion: number;
  scored: boolean;
}

export interface SessionRecord {
  sessionId: string;
  createdAt: string;
  completedAt: string | null;
  mode: PracticeMode;
  questionIds: string[];
  moduleIds: string[];
  timed: boolean;
  timeLimitSeconds: number | null;
  scored: boolean;
  contentVersion: number;
}

export interface ExportBundle {
  app: 'menopause-compass';
  schemaVersion: number;
  contentVersion: number;
  exportedAt: string;
  sessions: SessionRecord[];
  attempts: Attempt[];
  bookmarks?: string[];
}

/* ───────────── IndexedDB core ───────────── */

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'sessionId' });
      if (!db.objectStoreNames.contains('attempts')) {
        const s = db.createObjectStore('attempts', { keyPath: 'id' });
        s.createIndex('bySession', 'sessionId');
        s.createIndex('byQuestion', 'questionId');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Could not open local database.'));
  });
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        const req = fn(s);
        let result: T | undefined;
        if (req) req.onsuccess = () => (result = req.result);
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error ?? new Error('Local storage transaction failed.'));
        t.onabort = () => reject(t.error ?? new Error('Local storage transaction aborted.'));
      })
  );
}

export async function saveSession(s: SessionRecord): Promise<void> {
  await tx('sessions', 'readwrite', (st) => st.put(s));
}

export async function saveAttempt(a: Attempt): Promise<void> {
  await tx('attempts', 'readwrite', (st) => st.put(a));
}

export async function getAllSessions(): Promise<SessionRecord[]> {
  return ((await tx<SessionRecord[]>('sessions', 'readonly', (st) => st.getAll())) ?? []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getAllAttempts(): Promise<Attempt[]> {
  return (await tx<Attempt[]>('attempts', 'readonly', (st) => st.getAll())) ?? [];
}

export async function getAttemptsForSession(sessionId: string): Promise<Attempt[]> {
  const all = await getAllAttempts();
  return all.filter((a) => a.sessionId === sessionId);
}

export async function clearProgress(): Promise<void> {
  await tx('sessions', 'readwrite', (st) => st.clear());
  await tx('attempts', 'readwrite', (st) => st.clear());
  safeLocal.remove(ACTIVE_SESSION_KEY);
}

export async function exportProgress(): Promise<ExportBundle> {
  const [sessions, attempts] = await Promise.all([getAllSessions(), getAllAttempts()]);
  return {
    app: 'menopause-compass',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    exportedAt: new Date().toISOString(),
    sessions,
    attempts,
    bookmarks: getBookmarks()
  };
}

/** Validate + migrate an imported bundle. Throws a human-readable Error on failure. */
export function parseImport(text: string): ExportBundle {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON. Please choose a file exported from Menopause Compass.');
  }
  const d = data as Partial<ExportBundle>;
  if (!d || d.app !== 'menopause-compass') throw new Error('This file was not exported from Menopause Compass.');
  if (typeof d.schemaVersion !== 'number' || d.schemaVersion > EXPORT_SCHEMA_VERSION)
    throw new Error('This file comes from a newer version of the app. Please update and try again.');
  if (!Array.isArray(d.sessions) || !Array.isArray(d.attempts)) throw new Error('The file is missing progress data.');
  // Future migrations go here: if (d.schemaVersion === 1) { ... }
  const attempts = d.attempts.filter(
    (a): a is Attempt => !!a && typeof a.id === 'string' && typeof a.questionId === 'string' && typeof a.sessionId === 'string'
  );
  const sessions = d.sessions.filter((s): s is SessionRecord => !!s && typeof s.sessionId === 'string');
  return {
    app: 'menopause-compass',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    contentVersion: d.contentVersion ?? CONTENT_VERSION,
    exportedAt: d.exportedAt ?? new Date().toISOString(),
    sessions,
    attempts: attempts.map((a) => ({ ...a, scored: a.scored ?? a.mode !== 'demo' })),
    bookmarks: Array.isArray(d.bookmarks) ? d.bookmarks.filter((b) => typeof b === 'string') : []
  };
}

export async function importProgress(bundle: ExportBundle): Promise<{ sessions: number; attempts: number }> {
  for (const s of bundle.sessions) await saveSession(s);
  for (const a of bundle.attempts) await saveAttempt(a);
  if (bundle.bookmarks?.length) setBookmarks([...new Set([...getBookmarks(), ...bundle.bookmarks])]);
  return { sessions: bundle.sessions.length, attempts: bundle.attempts.length };
}

/* ───────────── Guarded localStorage ───────────── */

export const safeLocal = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
};

export const ACTIVE_SESSION_KEY = 'mc.activeSession';
export const AUDIENCE_KEY = 'mc.audience';
export const VISIT_PREP_KEY = 'mc.visitPrep';
export const BOOKMARKS_KEY = 'mc.bookmarks';
export const SIDEBAR_KEY = 'mc.sidebarCollapsed';
export const MILESTONES_KEY = 'mc.milestones';

export function getBookmarks(): string[] {
  return safeLocal.get<string[]>(BOOKMARKS_KEY, []);
}
export function setBookmarks(ids: string[]) {
  safeLocal.set(BOOKMARKS_KEY, ids);
}

export function newId(prefix = 's'): string {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
}
