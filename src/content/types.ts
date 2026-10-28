/**
 * Menopause Compass — content schemas.
 * Shared evidence records (Fact) feed separate patient and clinician renderings.
 * Every clinical assertion should trace back to a Source via a Reference.
 */

export type ReviewStatus = 'draft' | 'reviewed' | 'outdated';
export type SourceType =
  | 'position-statement'
  | 'regulatory'
  | 'guideline'
  | 'educational-deck'
  | 'certification'
  | 'study-tool';
export type SourceCurrency = 'current' | 'partly-superseded' | 'review-needed';

export interface Source {
  id: string;
  /** Short code shown in source labels, e.g. "HT 2022" */
  code: string;
  title: string;
  publisher: string;
  year: number;
  citation: string;
  url?: string;
  type: SourceType;
  /** Date (ISO) an editor last confirmed this source is still current */
  lastChecked: string;
  currency: SourceCurrency;
  note?: string;
}

export interface Reference {
  sourceId: string;
  section?: string;
  page?: string;
}

/** 'statement' = directly stated in a source; 'interpretive' = editorial synthesis/teaching note */
export type Derivation = 'statement' | 'interpretive';

export interface Fact {
  id: string;
  topicId: string;
  moduleId: string;
  title: string;
  shortPatientAnswer: string;
  clinicianPearl: string;
  expandedExplanation: string;
  redFlags: string[];
  examTraps: string[];
  synonyms: string[];
  references: Reference[];
  derivation: Derivation;
  drafted: string;
  /** ISO date of clinical review; null until a clinician signs off */
  lastReviewed: string | null;
  reviewer: string | null;
  status: ReviewStatus;
  contentVersion: number;
}

export interface CareOption {
  name: string;
  what: string;
  goodFor: string;
  consider: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  /** one-line description for tiles */
  blurb: string;
  icon: string;
  /** 2–3 sentence short answer shown first */
  shortAnswer: string;
  whatItIs: string[];
  symptoms: string[];
  options: CareOption[];
  myths: { myth: string; fact: string }[];
  seeClinician: string[];
  factIds: string[];
  synonyms: string[];
  featured?: boolean;
}

export interface FAQ {
  id: string;
  slug: string;
  question: string;
  conciseAnswer: string;
  detailsBlocks: { heading?: string; body: string }[];
  nextSteps: string[];
  relatedFaqIds: string[];
  topicIds: string[];
  sourceFactIds: string[];
  clinicalEscalationNotice?: string;
  synonyms: string[];
  locale: 'en';
  popular?: boolean;
}

export interface ReviewTable {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface ReviewModule {
  id: string;
  slug: string;
  number: number;
  title: string;
  blurb: string;
  category: 'Foundations' | 'Treatment' | 'Organ systems' | 'Special populations';
  oneMinute: string[];
  decisionRules: string[];
  tables: ReviewTable[];
  traps: string[];
  pearls: { text: string; factId?: string }[];
  interpretiveNotes: string[];
  factIds: string[];
  references: Reference[];
  status: ReviewStatus;
  lastReviewed: string | null;
  keywords: string[];
}

export type Difficulty = 'recall' | 'application' | 'analysis';
export type QuestionStatus = 'draft' | 'verified' | 'retired';

export interface Choice {
  id: string;
  text: string;
}

export interface QuestionItem {
  id: string;
  moduleId: string;
  stem: string;
  /** 3–5 options; the official exam currently uses 3 (A–C) */
  choices: Choice[];
  correctChoiceId: string;
  rationale: string;
  wrongAnswerRationales: Record<string, string>;
  learningObjective: string;
  sourceFactIds: string[];
  references: Reference[];
  difficulty: Difficulty;
  examTrapTags: string[];
  author: string;
  verifier: string | null;
  reviewedAt: string | null;
  status: QuestionStatus;
}

export interface TestingWindow {
  label: string;
  opens: string;
  closes: string;
  applicationDeadline: string;
}

export interface CertificationRecord {
  sourceUrl: string;
  candidateHandbookUrl: string;
  applicationUrl: string;
  renewalUrl: string;
  eligibilitySummary: string;
  format: string[];
  contentOutline: { domain: string; weight: string }[];
  testingWindows: TestingWindow[];
  fees: { label: string; amount: string }[];
  renewal: string[];
  retake: string;
  lastVerified: string;
  validThrough: string;
  verificationStatus: 'verified' | 'verification-needed';
  editorApproval: string | null;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Master' | 'Tutor' | 'MCQ' | 'Weak area' | 'Clinical scenario' | 'Study plan';
  description: string;
  variables: { key: string; label: string; defaultValue: string }[];
  body: string;
}
