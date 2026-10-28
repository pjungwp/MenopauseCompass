import { useState } from 'react';
import { ExternalLink, ShieldAlert, CalendarPlus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { certification, isCertificationStale } from '@/content';
import { Callout, PageTitle } from '@/components/ui/primitives';
import { formatDate } from '@/lib/format';
import { MILESTONES_KEY, safeLocal } from '@/lib/storage';
import { usePageTitle } from '@/lib/usePageTitle';

interface Milestone {
  id: string;
  label: string;
  date: string;
  done: boolean;
}

/* ═════════════ A02 — Certification path ═════════════ */
export function CertificationPage() {
  usePageTitle('Certification path');
  const stale = isCertificationStale();
  const c = certification;
  const now = new Date();
  const steps = [
    {
      title: 'Confirm eligibility',
      body: c.eligibilitySummary,
      link: { href: c.sourceUrl, label: 'Official MSCP page' }
    },
    {
      title: 'Read the candidate handbook',
      body: 'Review the content outline, policies, and remote-proctoring requirements before applying.',
      link: { href: c.candidateHandbookUrl, label: 'Candidate handbook (PDF)' }
    },
    {
      title: 'Apply and pay',
      body: 'Applications with full payment are due at least 30 days before a testing window opens. Late applications roll to the next window.',
      link: { href: c.applicationUrl, label: 'Application portal' }
    },
    {
      title: 'Test, then maintain',
      body: 'Schedule within your window and test remotely or at a center. The credential lasts 3 years; renew by CME or reexamination.',
      link: { href: c.renewalUrl, label: 'Maintenance requirements' }
    }
  ];

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow="MSCP Academy" title="Certification path" />
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-lavender px-3 py-2.5 text-[14px]">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-teal" aria-hidden />
        <p>
          <strong>Independent preparation resource.</strong> Not affiliated with or endorsed by The Menopause Society. Always confirm requirements on the official site.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ol className="relative min-w-0 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="card flex gap-4 p-4">
              <span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-[16px] font-bold text-white" aria-hidden>{i + 1}</span>
              <div className="min-w-0">
                <h2 className="text-[16px] font-semibold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h2>
                <p className="mt-1 text-[15px]">{s.body}</p>
                <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold">
                  {s.link.label} <ExternalLink size={14} aria-label="(opens in a new tab)" />
                </a>
              </div>
            </li>
          ))}
        </ol>

        <aside className="min-w-0 space-y-4">
          <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            Official certification page <ExternalLink size={16} aria-hidden />
          </a>

          <section className="card p-4" aria-labelledby="cert-facts">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="cert-facts" className="text-[16px] font-semibold">Key facts</h2>
              <span className={`badge ${stale ? 'bg-terra-soft text-terra' : 'bg-ok-soft text-ok'}`}>
                {stale ? 'Verification needed' : `Checked ${formatDate(c.lastVerified)}`}
              </span>
            </div>
            {stale ? (
              <div className="mt-3">
                <Callout tone="caution" title="Check the official site">
                  Our saved dates and fees are past their verification window, so we've hidden them to avoid showing stale details.
                </Callout>
              </div>
            ) : (
              <div className="mt-3 space-y-4 text-[14px]">
                <div>
                  <h3 className="font-semibold">Exam format</h3>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">{c.format.map((f) => <li key={f}>{f}</li>)}</ul>
                </div>
                <div>
                  <h3 className="font-semibold">Testing windows</h3>
                  <ul className="mt-1 space-y-1">
                    {c.testingWindows.map((w) => {
                      const past = new Date(w.closes + 'T23:59:59') < now;
                      const closed = new Date(w.applicationDeadline + 'T23:59:59') < now;
                      return (
                        <li key={w.label} className={`flex justify-between gap-2 ${past ? 'text-slate line-through' : ''}`}>
                          <span>{w.label}</span>
                          <span className="tabular text-right">{closed && !past ? 'Applications closed' : `Apply by ${formatDate(w.applicationDeadline, { month: 'short', day: 'numeric', year: 'numeric' })}`}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Fees</h3>
                  <dl className="mt-1 space-y-0.5">
                    {c.fees.map((f) => (
                      <div key={f.label} className="flex justify-between gap-2"><dt>{f.label}</dt><dd className="tabular m-0 font-medium">{f.amount}</dd></div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold">Content outline</h3>
                  <dl className="mt-1 space-y-0.5">
                    {c.contentOutline.map((d) => (
                      <div key={d.domain} className="flex justify-between gap-3"><dt>{d.domain}</dt><dd className="tabular m-0 font-medium">{d.weight}</dd></div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold">Renewal & retakes</h3>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {c.renewal.map((r) => <li key={r}>{r}</li>)}
                    <li>{c.retake}</li>
                  </ul>
                </div>
                <p className="meta">Source: 2027 Candidate Handbook and menopause.org, verified {formatDate(c.lastVerified)}. Valid through {formatDate(c.validThrough)}.</p>
              </div>
            )}
          </section>

          <Milestones />
        </aside>
      </div>
    </div>
  );
}

/** Personal study milestones — stored locally only. */
function Milestones() {
  const [items, setItems] = useState<Milestone[]>(() => safeLocal.get<Milestone[]>(MILESTONES_KEY, []));
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const save = (next: Milestone[]) => {
    setItems(next);
    safeLocal.set(MILESTONES_KEY, next);
  };
  return (
    <section className="card p-4" aria-labelledby="ms-h">
      <h2 id="ms-h" className="text-[16px] font-semibold">My study milestones</h2>
      <p className="meta mt-0.5">Saved on this device only.</p>
      <form
        className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_150px_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim()) return;
          save([...items, { id: String(Date.now()), label: label.trim(), date, done: false }].sort((a, b) => (a.date || '9').localeCompare(b.date || '9')));
          setLabel('');
          setDate('');
        }}
      >
        <label className="sr-only" htmlFor="ms-label">Milestone</label>
        <input id="ms-label" className="input" placeholder="e.g. Submit application" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={80} />
        <label className="sr-only" htmlFor="ms-date">Date</label>
        <input id="ms-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" className="btn btn-secondary"><CalendarPlus size={18} aria-hidden /> Add</button>
      </form>
      {items.length > 0 && (
        <ul className="mt-3 space-y-1">
          {items.map((m) => (
            <li key={m.id} className="flex items-center gap-2 rounded-lg px-1 text-[14px]">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-md hover:bg-sage"
                aria-label={m.done ? `Mark "${m.label}" not done` : `Mark "${m.label}" done`}
                aria-pressed={m.done}
                onClick={() => save(items.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)))}
              >
                {m.done ? <CheckCircle2 size={20} className="text-ok" aria-hidden /> : <Circle size={20} className="text-slate" aria-hidden />}
              </button>
              <span className={`min-w-0 flex-1 ${m.done ? 'text-slate line-through' : ''}`}>{m.label}</span>
              {m.date && <span className="tabular text-slate">{formatDate(m.date, { month: 'short', day: 'numeric' })}</span>}
              <button type="button" className="grid h-10 w-10 place-items-center rounded-md text-slate hover:bg-sage" aria-label={`Delete "${m.label}"`} onClick={() => save(items.filter((x) => x.id !== m.id))}>
                <Trash2 size={16} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
