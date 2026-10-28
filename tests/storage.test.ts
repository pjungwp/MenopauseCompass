import { describe, expect, it } from 'vitest';
import { saveAttempt, saveSession, exportProgress, parseImport, importProgress, clearProgress, getAllAttempts } from '@/lib/storage';

describe('local progress storage', () => {
  it('saves, exports, clears and re-imports progress', async () => {
    await saveSession({ sessionId: 's1', createdAt: '2026-10-28T00:00:00Z', completedAt: '2026-10-28T00:10:00Z', mode: 'demo', questionIds: ['q-m1-01'], moduleIds: [], timed: false, timeLimitSeconds: null, scored: false, contentVersion: 1 });
    await saveAttempt({ id: 's1:q-m1-01', sessionId: 's1', createdAt: '2026-10-28T00:01:00Z', mode: 'demo', questionId: 'q-m1-01', selectedId: 'b', correct: true, durationSeconds: 40, flagged: false, moduleTags: ['m1'], contentVersion: 1, scored: false });
    const bundle = await exportProgress();
    expect(bundle.attempts).toHaveLength(1);
    await clearProgress();
    expect(await getAllAttempts()).toHaveLength(0);
    const parsed = parseImport(JSON.stringify(bundle));
    await importProgress(parsed);
    expect(await getAllAttempts()).toHaveLength(1);
  });

  it('rejects foreign or malformed files with readable errors', () => {
    expect(() => parseImport('not json')).toThrow(/valid JSON/);
    expect(() => parseImport('{"app":"other"}')).toThrow(/not exported/);
    expect(() => parseImport('{"app":"menopause-compass","schemaVersion":99,"sessions":[],"attempts":[]}')).toThrow(/newer version/);
  });
});
