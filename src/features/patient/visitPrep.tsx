import { useEffect, useMemo, useRef, useState } from 'react';
import { Printer, Copy, RotateCcw, Lock, Plus, Eye, Pencil, X } from 'lucide-react';
import { topics, topicById } from '@/content';
import { visitQuestions, generalVisitQuestions } from '@/content/visitQuestions';
import { safeLocal, VISIT_PREP_KEY } from '@/lib/storage';
import { Callout } from '@/components/ui/primitives';
import { copyText, useToast } from '@/components/ui/Toast';
import { TopicIcon } from '@/components/ui/Icon';
import { usePageTitle } from '@/lib/usePageTitle';

interface PrepState {
  topics: string[];
  symptoms: string[];
  questions: string[];
  custom: string[];
  notes: string;
}
const EMPTY: PrepState = { topics: [], symptoms: [], questions: [], custom: [], notes: '' };

/** Local-only visit preparation. Nothing is transmitted; data can be cleared at any time. */
export function VisitPrepPage() {
  usePageTitle('Prepare for your visit');
  const [s, setS] = useState<PrepState>(() => ({ ...EMPTY, ...safeLocal.get<PrepState>(VISIT_PREP_KEY, EMPTY) }));
  const [saveOk, setSaveOk] = useState(true);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [customDraft, setCustomDraft] = useState('');
  const toast = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSaveOk(safeLocal.set(VISIT_PREP_KEY, s));
  }, [s]);

  const toggle = (key: 'topics' | 'symptoms' | 'questions', value: string) =>
    setS((p) => ({ ...p, [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value] }));

  const allQuestions = useMemo(() => [...s.questions, ...s.custom], [s.questions, s.custom]);
  const plain = useMemo(() => toPlainText(s), [s]);

  const reset = () => {
    if (!window.confirm('Clear all of your visit notes from this device?')) return;
    setS(EMPTY);
    safeLocal.remove(VISIT_PREP_KEY);
    toast('Cleared from this device');
  };

  const addCustom = () => {
    const v = customDraft.trim();
    if (!v) return;
    setS((p) => ({ ...p, custom: [...p.custom, v] }));
    setCustomDraft('');
  };

  return (
    <div className="page-pad container-patient pt-5 sm:pt-8 pb-28 lg:pb-8">
      <div className="no-print">
        <p className="eyebrow">Patient guide</p>
        <h1 className="mt-1 text-[24px] font-bold sm:text-[30px]">Prepare for your visit</h1>
        <p className="mt-1 max-w-[62ch] text-slate">Pick what you want to talk about. We'll build a one-page list you can print, save as PDF, or copy.</p>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-sage p-3 text-[14px]">
          <Lock size={16} className="mt-0.5 shrink-0 text-teal" aria-hidden />
          <p>
            <strong>Stays on this device.</strong> Your choices are saved only in this browser and are never sent to us. Use <em>Clear all</em> when you're done, especially on a shared device.
          </p>
        </div>
        {!saveOk && (
          <div className="mt-3">
            <Callout tone="caution">This browser is blocking local storage, so your list won't be remembered if you leave the page. You can still print or copy it.</Callout>
          </div>
        )}
      </div>

      {/* Mobile view switch */}
      <div className="no-print mt-4 flex rounded-xl border border-line-strong bg-surface p-1 lg:hidden" role="tablist" aria-label="Visit prep view">
        {(['edit', 'preview'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={mobileView === v}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg text-[15px] font-semibold ${mobileView === v ? 'bg-teal text-white' : 'text-ink'}`}
            onClick={() => setMobileView(v)}
          >
            {v === 'edit' ? <Pencil size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
            {v === 'edit' ? 'Choose' : `Preview (${allQuestions.length})`}
          </button>
        ))}
      </div>

      <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
        {/* Chooser */}
        <div className={`no-print min-w-0 space-y-4 ${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
          <section className="card p-4" aria-labelledby="vp-topics">
            <h2 id="vp-topics" className="text-[17px] font-semibold">1. What would you like to discuss?</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Topics">
              {topics.map((t) => (
                <button key={t.id} type="button" className="chip" aria-pressed={s.topics.includes(t.id)} onClick={() => toggle('topics', t.id)}>
                  <TopicIcon name={t.icon} size={16} /> {t.title}
                </button>
              ))}
            </div>
          </section>

          {s.topics.map((id) => {
            const t = topicById[id];
            if (!t) return null;
            const qs = visitQuestions[id] ?? [];
            return (
              <section key={id} className="card p-4" aria-labelledby={`vp-${id}`}>
                <h2 id={`vp-${id}`} className="flex items-center gap-2 text-[17px] font-semibold">
                  <TopicIcon name={t.icon} size={18} className="text-teal" /> {t.title}
                </h2>
                {t.symptoms.length > 0 && (
                  <fieldset className="mt-3">
                    <legend className="text-[14px] font-semibold text-slate">Symptoms I've noticed</legend>
                    <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
                      {t.symptoms.map((sym) => (
                        <CheckRow key={sym} label={sym} checked={s.symptoms.includes(sym)} onChange={() => toggle('symptoms', sym)} />
                      ))}
                    </div>
                  </fieldset>
                )}
                <fieldset className="mt-3">
                  <legend className="text-[14px] font-semibold text-slate">Questions to ask</legend>
                  <div className="mt-1.5 grid gap-1">
                    {qs.map((q) => (
                      <CheckRow key={q} label={q} checked={s.questions.includes(q)} onChange={() => toggle('questions', q)} />
                    ))}
                  </div>
                </fieldset>
              </section>
            );
          })}

          <section className="card p-4" aria-labelledby="vp-general">
            <h2 id="vp-general" className="text-[17px] font-semibold">{s.topics.length ? `${s.topics.length + 2}.` : '2.'} Good questions for any visit</h2>
            <div className="mt-2 grid gap-1">
              {generalVisitQuestions.map((q) => (
                <CheckRow key={q} label={q} checked={s.questions.includes(q)} onChange={() => toggle('questions', q)} />
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="vp-custom" className="text-[14px] font-semibold">Add your own question</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="vp-custom"
                  className="input"
                  value={customDraft}
                  maxLength={200}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustom();
                    }
                  }}
                  placeholder="Type a question"
                />
                <button type="button" className="btn btn-secondary" onClick={addCustom} aria-label="Add question">
                  <Plus size={18} aria-hidden />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              {s.custom.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {s.custom.map((c, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-sage px-3 py-1.5 text-[15px]">
                      <span className="min-w-0">{c}</span>
                      <button
                        type="button"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-surface"
                        aria-label={`Remove question: ${c}`}
                        onClick={() => setS((p) => ({ ...p, custom: p.custom.filter((_, j) => j !== i) }))}
                      >
                        <X size={16} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="card p-4">
            <label htmlFor="vp-notes" className="text-[17px] font-semibold">Notes for my clinician <span className="text-[14px] font-normal text-slate">(optional)</span></label>
            <p className="meta mt-0.5">For example: when symptoms started, medicines you take, your last period. Stays on this device.</p>
            <textarea
              id="vp-notes"
              className="input mt-2 min-h-[110px]"
              maxLength={1500}
              value={s.notes}
              onChange={(e) => setS((p) => ({ ...p, notes: e.target.value }))}
            />
          </section>
        </div>

        {/* Live preview / print sheet */}
        <div className={`min-w-0 ${mobileView === 'edit' ? 'hidden lg:block print:block' : ''}`}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+20px)]">
            <div ref={previewRef} className="card p-5 print:border-0 print:p-0" aria-labelledby="vp-preview-h">
              <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
                <h2 id="vp-preview-h" className="text-[18px] font-bold">My visit questions</h2>
                <span className="meta">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {s.topics.length === 0 && allQuestions.length === 0 && !s.notes ? (
                <p className="mt-4 text-[15px] text-slate">Choose topics and questions to build your list.</p>
              ) : (
                <div className="mt-3 space-y-4 text-[15px]">
                  {s.topics.length > 0 && (
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-wide text-slate">I'd like to discuss</h3>
                      <p className="mt-1">{s.topics.map((id) => topicById[id]?.title).filter(Boolean).join(' · ')}</p>
                    </div>
                  )}
                  {s.symptoms.length > 0 && (
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-wide text-slate">Symptoms I've noticed</h3>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">{s.symptoms.map((x) => <li key={x}>{x}</li>)}</ul>
                    </div>
                  )}
                  {allQuestions.length > 0 && (
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-wide text-slate">My questions</h3>
                      <ol className="mt-1 list-decimal space-y-1 pl-5">{allQuestions.map((x, i) => <li key={i}>{x}</li>)}</ol>
                    </div>
                  )}
                  {s.notes.trim() && (
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-wide text-slate">Notes</h3>
                      <p className="mt-1 whitespace-pre-wrap">{s.notes}</p>
                    </div>
                  )}
                </div>
              )}
              <p className="mt-5 border-t border-line pt-2 text-[12px] text-slate">Prepared with Menopause Compass — general education, not medical advice.</p>
            </div>
            <div className="no-print mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer size={18} aria-hidden /> Print / save PDF</button>
              <button type="button" className="btn btn-secondary" onClick={async () => toast((await copyText(plain)) ? 'Copied to clipboard' : 'Could not copy', 'ok')}>
                <Copy size={18} aria-hidden /> Copy
              </button>
              <button type="button" className="btn btn-danger" onClick={reset}><RotateCcw size={18} aria-hidden /> Clear all</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile action */}
      {mobileView === 'edit' && (
        <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pt-3 lg:hidden" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
          <button type="button" className="btn btn-primary w-full" onClick={() => { setMobileView('preview'); window.scrollTo({ top: 0 }); }}>
            <Eye size={18} aria-hidden /> Preview questions ({allQuestions.length})
          </button>
        </div>
      )}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-[15px] hover:bg-sage">
      <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--teal)]" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function toPlainText(s: PrepState): string {
  const lines = ['My visit questions', ''];
  if (s.topics.length) lines.push("I'd like to discuss: " + s.topics.map((id) => topicById[id]?.title).filter(Boolean).join(', '), '');
  if (s.symptoms.length) lines.push("Symptoms I've noticed:", ...s.symptoms.map((x) => `- ${x}`), '');
  const qs = [...s.questions, ...s.custom];
  if (qs.length) lines.push('My questions:', ...qs.map((x, i) => `${i + 1}. ${x}`), '');
  if (s.notes.trim()) lines.push('Notes:', s.notes.trim());
  return lines.join('\n');
}
