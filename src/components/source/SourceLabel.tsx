import { Link } from 'react-router-dom';
import { ShieldCheck, FileClock, AlertTriangle, ExternalLink } from 'lucide-react';
import { factById, sourceById } from '@/content';
import type { Reference } from '@/content';
import { evidenceFor } from '@/lib/search';
import { formatDate } from '@/lib/format';

/** Compact evidence badge for result cards. */
export function EvidenceBadge({ factIds }: { factIds: string[] }) {
  const ev = evidenceFor(factIds);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {ev.codes.slice(0, 3).map((c) => (
        <span key={c} className="badge bg-sage text-ink">{c}</span>
      ))}
      <ReviewStatusBadge status={ev.status} lastReviewed={ev.lastReviewed} />
      {ev.anyOutdatedSource && (
        <span className="badge bg-terra-soft text-terra" title="One or more sources may be partly superseded">
          <AlertTriangle size={12} aria-hidden /> Source update
        </span>
      )}
    </span>
  );
}

export function ReviewStatusBadge({ status, lastReviewed }: { status: 'draft' | 'reviewed' | 'outdated'; lastReviewed: string | null }) {
  if (status === 'reviewed' && lastReviewed)
    return (
      <span className="badge bg-ok-soft text-ok">
        <ShieldCheck size={12} aria-hidden /> Reviewed {formatDate(lastReviewed)}
      </span>
    );
  if (status === 'outdated')
    return (
      <span className="badge bg-terra-soft text-terra">
        <AlertTriangle size={12} aria-hidden /> Older source / review needed
      </span>
    );
  return (
    <span className="badge bg-lavender text-ink">
      <FileClock size={12} aria-hidden /> Draft · clinical review pending
    </span>
  );
}

/** Full source block for detail pages. */
export function SourceBlock({ factIds, extraRefs = [], audience = 'patient' }: { factIds: string[]; extraRefs?: Reference[]; audience?: 'patient' | 'academy' }) {
  const refs = new Map<string, Set<string>>();
  const add = (r: Reference) => {
    if (!refs.has(r.sourceId)) refs.set(r.sourceId, new Set());
    if (r.section) refs.get(r.sourceId)!.add(r.section);
  };
  factIds.forEach((id) => factById[id]?.references.forEach(add));
  extraRefs.forEach(add);
  const ev = evidenceFor(factIds);

  return (
    <section aria-labelledby="sources-h" className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="sources-h" className="text-[16px] font-semibold">Sources & review</h2>
        <ReviewStatusBadge status={ev.status} lastReviewed={ev.lastReviewed} />
      </div>
      <ul className="mt-3 space-y-3">
        {[...refs.entries()].map(([sid, sections]) => {
          const s = sourceById[sid];
          if (!s) return null;
          return (
            <li key={sid} className="text-[14px] leading-snug">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="badge bg-sage text-ink">{s.code}</span>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium">
                    {s.title}
                    <ExternalLink size={12} className="ml-1 inline align-[-1px]" aria-label="(opens in a new tab)" />
                  </a>
                ) : (
                  <span className="font-medium">{s.title}</span>
                )}
              </div>
              <p className="meta mt-1">
                {s.publisher}, {s.year}
                {sections.size > 0 && audience === 'academy' && <> · {[...sections].join('; ')}</>} · Checked {formatDate(s.lastChecked)}
              </p>
              {s.currency !== 'current' && (
                <p className="mt-1 flex items-start gap-1.5 text-[13px] text-terra">
                  <AlertTriangle size={14} aria-hidden className="mt-0.5 shrink-0" />
                  <span>{s.currency === 'partly-superseded' ? 'Partly superseded: ' : 'Review needed: '}{s.note}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="meta mt-4">
        Content is drafted from these sources and edited for {audience === 'patient' ? 'plain language' : 'study use'}.{' '}
        <Link to="/sources">How we review content</Link>
      </p>
    </section>
  );
}
