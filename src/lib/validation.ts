import { facts, faqs, topics, modules, questions, sources, sourceById, factById, faqById, topicById, moduleById } from '@/content';
import { isValidItem } from './quiz';

export interface ContentIssue {
  level: 'error' | 'warning';
  where: string;
  message: string;
}

/** Integrity checks: every reference resolves, every cross-link exists, items are well formed. */
export function validateContent(): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  const dup = (ids: string[], label: string) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) err(label, `Duplicate id ${id}`);
      seen.add(id);
    }
  };
  dup(sources.map((s) => s.id), 'sources');
  dup(facts.map((f) => f.id), 'facts');
  dup(faqs.map((f) => f.id), 'faqs');
  dup(faqs.map((f) => f.slug), 'faq slugs');
  dup(topics.map((t) => t.slug), 'topic slugs');
  dup(modules.map((m) => m.slug), 'module slugs');
  dup(questions.map((q) => q.id), 'questions');

  for (const f of facts) {
    if (!topicById[f.topicId]) err(`fact ${f.id}`, `Unknown topicId ${f.topicId}`);
    if (!moduleById[f.moduleId]) err(`fact ${f.id}`, `Unknown moduleId ${f.moduleId}`);
    if (!f.references.length) err(`fact ${f.id}`, 'No references');
    for (const r of f.references) if (!sourceById[r.sourceId]) err(`fact ${f.id}`, `Unknown source ${r.sourceId}`);
    if (f.status === 'reviewed' && (!f.lastReviewed || !f.reviewer)) err(`fact ${f.id}`, 'Reviewed without reviewer/date');
  }
  for (const q of faqs) {
    for (const id of q.sourceFactIds) if (!factById[id]) err(`faq ${q.id}`, `Unknown fact ${id}`);
    for (const id of q.relatedFaqIds) if (!faqById[id]) err(`faq ${q.id}`, `Unknown related faq ${id}`);
    for (const id of q.topicIds) if (!topicById[id]) err(`faq ${q.id}`, `Unknown topic ${id}`);
    if (!q.sourceFactIds.length) err(`faq ${q.id}`, 'FAQ has no source facts');
  }
  for (const t of topics) for (const id of t.factIds) if (!factById[id]) err(`topic ${t.id}`, `Unknown fact ${id}`);
  for (const m of modules) {
    for (const id of m.factIds) if (!factById[id]) err(`module ${m.id}`, `Unknown fact ${id}`);
    for (const p of m.pearls) if (p.factId && !factById[p.factId]) err(`module ${m.id}`, `Pearl references unknown fact ${p.factId}`);
    for (const r of m.references) if (!sourceById[r.sourceId]) err(`module ${m.id}`, `Unknown source ${r.sourceId}`);
    for (const tb of m.tables) for (const row of tb.rows) if (row.length !== tb.columns.length) err(`module ${m.id}`, `Table "${tb.title}" row length mismatch`);
  }
  for (const q of questions) {
    if (!moduleById[q.moduleId]) err(`question ${q.id}`, `Unknown module ${q.moduleId}`);
    if (!isValidItem(q)) err(`question ${q.id}`, 'Malformed item (choices / answer key / rationale)');
    for (const id of q.sourceFactIds) if (!factById[id]) err(`question ${q.id}`, `Unknown fact ${id}`);
    for (const r of q.references) if (!sourceById[r.sourceId]) err(`question ${q.id}`, `Unknown source ${r.sourceId}`);
    for (const c of q.choices) if (c.id !== q.correctChoiceId && !q.wrongAnswerRationales[c.id]) warn(`question ${q.id}`, `No rationale for distractor ${c.id}`);
    if (q.status === 'verified' && (!q.verifier || !q.reviewedAt)) err(`question ${q.id}`, 'Verified without verifier/date');
  }
  return issues;
}
