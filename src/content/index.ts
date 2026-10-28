import type { QuestionItem } from './types';
import rawQuestions from './questions.json';

export * from './types';
export { sources, sourceById } from './sources';
export { facts, factById } from './facts';
export { topics, topicById, topicBySlug } from './topics';
export { faqs, faqById, faqBySlug } from './faqs';
export { modules, moduleById, moduleBySlug } from './modules';
export { certification, isCertificationStale } from './certification';
export { prompts, fillPrompt } from './prompts';

export const questions = rawQuestions as unknown as QuestionItem[];
export const questionById = Object.fromEntries(questions.map((q) => [q.id, q])) as Record<string, QuestionItem>;

/** Bump when content changes in a way that affects saved progress. */
export const CONTENT_VERSION = 1;
export const CONTENT_RELEASE = '2026-10-28';
