import { describe, expect, it } from 'vitest';
import { buildSession, filterPool, eligibleQuestions, moduleStats, weakModuleIds, DEFAULT_CONFIG } from '@/lib/quiz';
import { questions } from '@/content';
import type { Attempt } from '@/lib/storage';

const seeded = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('quiz engine', () => {
  it('scored modes use verified items only', () => {
    expect(eligibleQuestions('practice').every((q) => q.status === 'verified')).toBe(true);
    expect(eligibleQuestions('timed').every((q) => q.status === 'verified')).toBe(true);
  });
  it('demo mode includes drafts but never retired items', () => {
    const demo = eligibleQuestions('demo');
    expect(demo.length).toBeGreaterThan(0);
    expect(demo.some((q) => q.status === 'retired')).toBe(false);
  });
  it('respects module filter and count', () => {
    const s = buildSession({ ...DEFAULT_CONFIG, mode: 'demo', moduleIds: ['m9'], count: 3 }, [], seeded());
    expect(s).toHaveLength(3);
    expect(s.every((q) => q.moduleId === 'm9')).toBe(true);
  });
  it('reports actual available count when fewer than requested', () => {
    const pool = filterPool({ ...DEFAULT_CONFIG, mode: 'demo', moduleIds: ['m1'], count: 50 });
    expect(pool.length).toBe(questions.filter((q) => q.moduleId === 'm1' && q.status !== 'retired').length);
  });
  it('computes module stats and weak modules', () => {
    const mk = (i: number, correct: boolean): Attempt => ({
      id: `s:${i}`, sessionId: 's', createdAt: new Date(2026, 0, i).toISOString(), mode: 'demo', questionId: `q${i}`,
      selectedId: 'a', correct, durationSeconds: 30, flagged: false, moduleTags: ['m9'], contentVersion: 1, scored: false
    });
    const attempts = [mk(1, false), mk(2, false), mk(3, true)];
    const st = moduleStats(attempts).find((s) => s.moduleId === 'm9')!;
    expect(st.pct).toBe(33);
    expect(weakModuleIds(attempts)).toEqual(['m9']);
  });
});
