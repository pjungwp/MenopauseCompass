import { buildSession, type SessionConfig } from '@/lib/quiz';
import { ACTIVE_SESSION_KEY, newId, safeLocal, saveSession, type Attempt } from '@/lib/storage';
import { CONTENT_VERSION } from '@/content';

export interface AnswerState {
  selected: string | null;
  submitted: boolean;
  flagged: boolean;
  seconds: number;
}

export interface ActiveSession {
  sessionId: string;
  config: SessionConfig;
  questionIds: string[];
  index: number;
  answers: Record<string, AnswerState>;
  startedAt: string;
  /** epoch ms when a timed session expires */
  deadline: number | null;
  scored: boolean;
}

export function loadActive(): ActiveSession | null {
  return safeLocal.get<ActiveSession | null>(ACTIVE_SESSION_KEY, null);
}
export function saveActive(s: ActiveSession) {
  safeLocal.set(ACTIVE_SESSION_KEY, s);
}
export function clearActive() {
  safeLocal.remove(ACTIVE_SESSION_KEY);
}

/** Build, persist and return a new session. Returns null when no eligible questions. */
export async function createSession(config: SessionConfig, attempts: Attempt[]): Promise<ActiveSession | null> {
  const items = buildSession(config, attempts);
  if (!items.length) return null;
  const scored = config.mode !== 'demo';
  const s: ActiveSession = {
    sessionId: newId('s'),
    config,
    questionIds: items.map((q) => q.id),
    index: 0,
    answers: Object.fromEntries(items.map((q) => [q.id, { selected: null, submitted: false, flagged: false, seconds: 0 }])),
    startedAt: new Date().toISOString(),
    deadline: config.timed ? Date.now() + config.secondsPerQuestion * items.length * 1000 : null,
    scored
  };
  saveActive(s);
  try {
    await saveSession({
      sessionId: s.sessionId,
      createdAt: s.startedAt,
      completedAt: null,
      mode: config.mode,
      questionIds: s.questionIds,
      moduleIds: config.moduleIds,
      timed: config.timed,
      timeLimitSeconds: config.timed ? config.secondsPerQuestion * items.length : null,
      scored,
      contentVersion: CONTENT_VERSION
    });
  } catch {
    /* Progress page surfaces storage errors; the session can still run from localStorage. */
  }
  return s;
}
