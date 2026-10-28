import Fuse from 'fuse.js';
import { faqs, topics, modules, facts, factById, sourceById } from '@/content';
import type { FAQ, Topic, ReviewModule, Fact } from '@/content';

/**
 * Synonym groups. If a query contains any phrase in a group, the search also
 * runs with the group's other phrases and keeps each document's best score.
 */
export const SYNONYM_GROUPS: string[][] = [
  ['hot flash', 'hot flashes', 'hot flush', 'hot flushes', 'vms', 'vasomotor', 'night sweats', 'sweats', 'flushing'],
  ['hrt', 'hormone replacement', 'hormone therapy', 'mht', 'menopausal hormone therapy', 'estrogen therapy', 'ht'],
  ['vaginal atrophy', 'atrophic vaginitis', 'gsm', 'genitourinary syndrome', 'vaginal dryness', 'vva', 'dry vagina'],
  ['painful sex', 'dyspareunia', 'pain with sex', 'pain during sex'],
  ['bone density', 'dxa', 'dexa', 'bone scan', 'osteoporosis test'],
  ['osteoporosis', 'thin bones', 'bone loss', 'osteopenia', 'low bone mass'],
  ['libido', 'sex drive', 'desire', 'hsdd'],
  ['brain fog', 'memory', 'forgetful', 'forgetfulness', 'concentration'],
  ['insomnia', 'trouble sleeping', "can't sleep", 'cant sleep', 'sleep problems'],
  ['bioidentical', 'compounded', 'bhrt', 'pellets', 'natural hormones'],
  ['black box', 'boxed warning', 'fda warning', 'label change'],
  ['blood clot', 'dvt', 'vte', 'pulmonary embolism', 'clot'],
  ['bleeding after menopause', 'postmenopausal bleeding', 'pmb', 'spotting'],
  ['perimenopause', 'the change', 'change of life', 'menopause transition'],
  ['uti', 'bladder infection', 'urinary infection', 'recurrent uti'],
  ['early menopause', 'premature menopause', 'poi', 'primary ovarian insufficiency', 'surgical menopause'],
  ['nonhormonal', 'non-hormonal', 'non hormonal', 'without hormones', 'alternatives'],
  ['fezolinetant', 'veozah', 'nk3', 'elinzanetant', 'lynkuet', 'neurokinin'],
  ['depression', 'low mood', 'anxiety', 'mood swings', 'irritability']
];

export function expandQuery(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const variants = new Set<string>([q]);
  for (const group of SYNONYM_GROUPS) {
    const hit = group.find((term) => new RegExp(`(^|\\W)${escapeRe(term)}(\\W|$)`).test(q));
    if (hit) {
      for (const alt of group) if (alt !== hit) variants.add(q.replace(hit, alt));
    }
  }
  return [...variants].slice(0, 12);
}

/** Returns the canonical label of the first matching synonym group, for "Showing results for…" hints. */
export function synonymHint(query: string): string | null {
  const q = query.toLowerCase().trim();
  for (const group of SYNONYM_GROUPS) {
    const hit = group.find((term) => new RegExp(`(^|\\W)${escapeRe(term)}(\\W|$)`).test(q));
    if (hit) {
      const others = group.filter((t) => t !== hit && t.length > 3).slice(0, 3);
      if (others.length) return `Also searching: ${others.join(', ')}`;
    }
  }
  return null;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ───────────── Patient index ───────────── */

export type PatientDoc =
  | { kind: 'faq'; id: string; title: string; synonyms: string; body: string; preview: string; href: string; topicIds: string[]; item: FAQ }
  | { kind: 'topic'; id: string; title: string; synonyms: string; body: string; preview: string; href: string; topicIds: string[]; item: Topic };

const patientDocs: PatientDoc[] = [
  ...faqs.map<PatientDoc>((f) => ({
    kind: 'faq',
    id: f.id,
    title: f.question,
    synonyms: [...f.synonyms, ...f.sourceFactIds.flatMap((id) => factById[id]?.synonyms ?? [])].join(' · '),
    body: [f.conciseAnswer, ...f.detailsBlocks.map((b) => b.body)].join(' '),
    preview: f.conciseAnswer,
    href: `/learn/faq/${f.slug}`,
    topicIds: f.topicIds,
    item: f
  })),
  ...topics.map<PatientDoc>((t) => ({
    kind: 'topic',
    id: t.id,
    title: t.title,
    synonyms: [...t.synonyms, t.blurb].join(' · '),
    body: [t.shortAnswer, ...t.whatItIs].join(' '),
    preview: t.shortAnswer,
    href: `/learn/topic/${t.slug}`,
    topicIds: [t.id],
    item: t
  }))
];

const patientFuse = new Fuse(patientDocs, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.38,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'synonyms', weight: 0.33 },
    { name: 'body', weight: 0.22 }
  ]
});

export interface Ranked<T> {
  doc: T;
  score: number;
}

function multiSearch<T extends { id: string; kind?: string }>(fuse: Fuse<T>, query: string, limit: number): Ranked<T>[] {
  const best = new Map<string, Ranked<T>>();
  expandQuery(query).forEach((variant, i) => {
    // Small penalty for synonym variants so exact-wording matches rank first.
    const penalty = i === 0 ? 0 : 0.05;
    for (const r of fuse.search(variant, { limit: limit * 2 })) {
      const key = `${(r.item as { kind?: string }).kind ?? ''}:${r.item.id}`;
      const score = (r.score ?? 1) + penalty;
      const prev = best.get(key);
      if (!prev || score < prev.score) best.set(key, { doc: r.item, score });
    }
  });
  return [...best.values()].sort((a, b) => a.score - b.score).slice(0, limit);
}

export function searchPatient(query: string, limit = 20): Ranked<PatientDoc>[] {
  if (!query.trim()) return [];
  return multiSearch(patientFuse, query, limit);
}

export function suggestPatient(query: string, limit = 6): PatientDoc[] {
  return searchPatient(query, limit).map((r) => r.doc);
}

/* ───────────── Academy index ───────────── */

export type AcademyDoc =
  | { kind: 'module'; id: string; title: string; synonyms: string; body: string; href: string; item: ReviewModule }
  | { kind: 'fact'; id: string; title: string; synonyms: string; body: string; href: string; item: Fact };

const academyDocs: AcademyDoc[] = [
  ...modules.map<AcademyDoc>((m) => ({
    kind: 'module',
    id: m.id,
    title: m.title,
    synonyms: [...m.keywords, m.blurb].join(' · '),
    body: [...m.oneMinute, ...m.traps].join(' '),
    href: `/academy/review/${m.slug}`,
    item: m
  })),
  ...facts.map<AcademyDoc>((f) => {
    const mod = modules.find((m) => m.id === f.moduleId);
    return {
      kind: 'fact',
      id: f.id,
      title: f.title,
      synonyms: f.synonyms.join(' · '),
      body: [f.clinicianPearl, f.expandedExplanation].join(' '),
      href: mod ? `/academy/review/${mod.slug}#${f.id}` : '/academy/review',
      item: f
    };
  })
];

const academyFuse = new Fuse(academyDocs, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.36,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'synonyms', weight: 0.35 },
    { name: 'body', weight: 0.2 }
  ]
});

export function searchAcademy(query: string, limit = 20): Ranked<AcademyDoc>[] {
  if (!query.trim()) return [];
  return multiSearch(academyFuse, query, limit);
}

/* ───────────── Evidence metadata for result cards ───────────── */

export interface EvidenceSummary {
  codes: string[];
  lastReviewed: string | null;
  anyOutdatedSource: boolean;
  status: 'draft' | 'reviewed' | 'outdated';
}

export function evidenceFor(factIds: string[]): EvidenceSummary {
  const fs = factIds.map((id) => factById[id]).filter(Boolean);
  const codes = new Set<string>();
  let anyOutdatedSource = false;
  for (const f of fs) {
    for (const r of f.references) {
      const s = sourceById[r.sourceId];
      if (s) {
        codes.add(s.code);
        if (s.currency !== 'current') anyOutdatedSource = true;
      }
    }
  }
  const reviewed = fs.map((f) => f.lastReviewed).filter((d): d is string => !!d);
  const status: EvidenceSummary['status'] = fs.some((f) => f.status === 'outdated')
    ? 'outdated'
    : fs.length > 0 && fs.every((f) => f.status === 'reviewed')
      ? 'reviewed'
      : 'draft';
  return {
    codes: [...codes],
    lastReviewed: reviewed.length === fs.length && reviewed.length ? reviewed.sort()[0] : null,
    anyOutdatedSource,
    status
  };
}

export const POPULAR_TOPIC_IDS = ['hot-flashes', 'hormone-therapy', 'perimenopause', 'vaginal-urinary', 'sleep-mood', 'bones'];
