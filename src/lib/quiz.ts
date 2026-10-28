import { questions, modules } from '@/content';
import type { QuestionItem, Difficulty } from '@/content';
import type { Attempt, PracticeMode } from './storage';

export interface SessionConfig {
  mode: PracticeMode;
  moduleIds: string[]; // empty = all
  count: number;
  difficulty: Difficulty | 'mixed';
  timed: boolean;
  /** seconds per question when timed; the real exam is 100 items / 120 min = 72 s */
  secondsPerQuestion: number;
}

export const DEFAULT_CONFIG: SessionConfig = {
  mode: 'practice',
  moduleIds: [],
  count: 10,
  difficulty: 'mixed',
  timed: false,
  secondsPerQuestion: 72
};

/** Only verified items may be scored. Demo mode uses draft items, clearly labeled and unscored. */
export function eligibleQuestions(mode: PracticeMode): QuestionItem[] {
  if (mode === 'demo') return questions.filter((q) => q.status === 'draft' || q.status === 'verified');
  return questions.filter((q) => q.status === 'verified');
}

export function isValidItem(q: QuestionItem): boolean {
  return (
    q.choices.length >= 3 &&
    q.choices.length <= 5 &&
    q.choices.some((c) => c.id === q.correctChoiceId) &&
    new Set(q.choices.map((c) => c.id)).size === q.choices.length &&
    q.stem.trim().length > 0 &&
    q.rationale.trim().length > 0
  );
}

export function filterPool(config: SessionConfig, attempts: Attempt[] = []): QuestionItem[] {
  let pool = eligibleQuestions(config.mode).filter(isValidItem);
  if (config.moduleIds.length) pool = pool.filter((q) => config.moduleIds.includes(q.moduleId));
  if (config.difficulty !== 'mixed') pool = pool.filter((q) => q.difficulty === config.difficulty);
  if (config.mode === 'weak') {
    const weak = new Set(weakQuestionIds(attempts));
    const weakModules = new Set(weakModuleIds(attempts));
    pool = pool.filter((q) => weak.has(q.id) || weakModules.has(q.moduleId));
  }
  return pool;
}

export function availableCount(config: SessionConfig, attempts: Attempt[] = []): number {
  return filterPool(config, attempts).length;
}

/** Deterministic-friendly shuffle (pass a seeded rng in tests). */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildSession(config: SessionConfig, attempts: Attempt[] = [], rng?: () => number): QuestionItem[] {
  const pool = filterPool(config, attempts);
  // Weak mode: missed items first, then others from weak modules
  if (config.mode === 'weak') {
    const missed = new Set(weakQuestionIds(attempts));
    const first = shuffle(pool.filter((q) => missed.has(q.id)), rng);
    const rest = shuffle(pool.filter((q) => !missed.has(q.id)), rng);
    return [...first, ...rest].slice(0, config.count);
  }
  return shuffle(pool, rng).slice(0, config.count);
}

/* ───────────── Analytics ───────────── */

/** Latest attempt per question, scored only (or demo if includeDemo). */
export function latestAttempts(attempts: Attempt[], includeDemo = false): Attempt[] {
  const latest = new Map<string, Attempt>();
  for (const a of attempts) {
    if (!includeDemo && !a.scored) continue;
    const prev = latest.get(a.questionId);
    if (!prev || a.createdAt > prev.createdAt) latest.set(a.questionId, a);
  }
  return [...latest.values()];
}

export function weakQuestionIds(attempts: Attempt[]): string[] {
  return latestAttempts(attempts, true)
    .filter((a) => !a.correct)
    .map((a) => a.questionId);
}

export interface ModuleStat {
  moduleId: string;
  title: string;
  number: number;
  answered: number;
  correct: number;
  pct: number | null;
}

export function moduleStats(attempts: Attempt[], includeDemo = true): ModuleStat[] {
  const counted = attempts.filter((a) => includeDemo || a.scored);
  return modules.map((m) => {
    const as = counted.filter((a) => a.moduleTags.includes(m.id));
    const correct = as.filter((a) => a.correct).length;
    return {
      moduleId: m.id,
      title: m.title,
      number: m.number,
      answered: as.length,
      correct,
      pct: as.length ? Math.round((correct / as.length) * 100) : null
    };
  });
}

/** Modules with ≥3 answers and <70% correct, worst first. */
export function weakModuleIds(attempts: Attempt[], minAnswered = 3, threshold = 70): string[] {
  return moduleStats(attempts)
    .filter((s) => s.answered >= minAnswered && (s.pct ?? 100) < threshold)
    .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0))
    .map((s) => s.moduleId);
}

export function trapTagCounts(attempts: Attempt[], byId: Record<string, QuestionItem>): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of attempts) {
    if (a.correct) continue;
    for (const t of byId[a.questionId]?.examTrapTags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}
