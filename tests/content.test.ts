import { describe, expect, it } from 'vitest';
import { validateContent } from '@/lib/validation';
import { facts, faqs, questions, topics, modules, certification } from '@/content';

describe('content integrity', () => {
  it('has no broken references, duplicate ids, or malformed items', () => {
    const errors = validateContent().filter((i) => i.level === 'error');
    expect(errors, JSON.stringify(errors, null, 2)).toEqual([]);
  });

  it('every patient-facing fact has a patient answer and at least one source', () => {
    for (const f of facts) {
      expect(f.shortPatientAnswer.length, f.id).toBeGreaterThan(40);
      expect(f.references.length, f.id).toBeGreaterThan(0);
    }
  });

  it('covers all ten review modules and every topic has at least one FAQ', () => {
    expect(modules.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const t of topics) expect(faqs.some((f) => f.topicIds.includes(t.id)), t.id).toBe(true);
  });

  it('no question ships as verified without a named verifier and date', () => {
    for (const q of questions.filter((x) => x.status === 'verified')) {
      expect(q.verifier).toBeTruthy();
      expect(q.reviewedAt).toBeTruthy();
    }
  });

  it('answer keys are not all the same letter (distribution check)', () => {
    const counts = new Map<number, number>();
    for (const q of questions) {
      const i = q.choices.findIndex((c) => c.id === q.correctChoiceId);
      counts.set(i, (counts.get(i) ?? 0) + 1);
    }
    for (const n of counts.values()) expect(n / questions.length).toBeLessThan(0.6);
  });

  it('certification data carries verification metadata', () => {
    expect(certification.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(certification.sourceUrl).toMatch(/^https:\/\/menopause\.org\//);
    expect(certification.validThrough >= certification.lastVerified).toBe(true);
  });
});
