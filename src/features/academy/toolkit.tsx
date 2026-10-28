import { useEffect, useMemo, useState } from 'react';
import { Copy, Download, RotateCcw, ExternalLink, X, ChevronRight, FileText, Info } from 'lucide-react';
import { prompts, fillPrompt, sources, moduleById } from '@/content';
import type { PromptTemplate } from '@/content';
import { copyText, useToast } from '@/components/ui/Toast';
import { PageTitle } from '@/components/ui/primitives';
import { downloadFile } from '@/lib/format';
import { weakModuleIds } from '@/lib/quiz';
import { usePageTitle } from '@/lib/usePageTitle';
import { useProgress } from './useProgress';

const destinations = [
  { label: 'Claude', href: 'https://claude.ai/new' },
  { label: 'ChatGPT', href: 'https://chatgpt.com/' },
  { label: 'Gemini', href: 'https://gemini.google.com/' }
];

/* ═════════════ A08 — AI Toolkit ═════════════ */
export function AIToolkitPage() {
  usePageTitle('AI Toolkit');
  const toast = useToast();
  const { attempts } = useProgress();
  const [selectedId, setSelectedId] = useState(prompts[0].id);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const p = prompts.find((x) => x.id === selectedId)!;

  // Prefill weak-area prompt from local progress
  const weakText = useMemo(() => weakModuleIds(attempts).map((id) => moduleById[id]?.title).filter(Boolean).join('; '), [attempts]);
  const vals = useMemo(() => {
    const base = Object.fromEntries(p.variables.map((v) => [v.key, v.defaultValue]));
    if (p.id === 'weak-area' && weakText) base.weakTopics = weakText;
    return { ...base, ...(values[p.id] ?? {}) };
  }, [p, values, weakText]);
  const filled = fillPrompt(p.body, vals);

  useEffect(() => {
    document.body.style.overflow = phoneOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phoneOpen]);

  const copy = async () => toast((await copyText(filled)) ? 'Prompt copied' : 'Could not copy — select the text manually', 'ok');
  const reset = () => setValues((v) => ({ ...v, [p.id]: {} }));
  const exportMd = () => downloadFile(`${p.id}-prompt.md`, `# ${p.title}\n\n${filled}\n`, 'text/markdown');
  const exportManifest = () =>
    downloadFile(
      'menopause-compass-reference-index.md',
      `# Reference index — Menopause Compass\n\nIndependent study resource. Verify against the source of record.\n\n${sources
        .map((s) => `- **${s.code}** — ${s.title}. ${s.publisher}, ${s.year}. ${s.citation}${s.url ? ` ${s.url}` : ''}${s.currency !== 'current' ? `\n  - Note: ${s.note ?? 'review needed'}` : ''}`)
        .join('\n')}\n`,
      'text/markdown'
    );

  const editor = (
    <PromptEditor
      p={p}
      vals={vals}
      filled={filled}
      onChange={(k, v) => setValues((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] ?? {}), [k]: v } }))}
      onCopy={copy}
      onReset={reset}
      onExport={exportMd}
    />
  );

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow="MSCP Academy" title="AI Toolkit">
        Copy-ready study prompts built on your PROVE concierge. Paste into any AI assistant.
      </PageTitle>
      <p className="mt-2 flex items-start gap-2 text-[13px] text-slate">
        <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
        Independent prompts, not official exam content. Nothing you type here is sent anywhere — prompts are copied to your clipboard only. Don't paste identifiable patient information into external AI tools.
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] min-[1440px]:grid-cols-[240px_minmax(0,1fr)_260px]">
        {/* Category list */}
        <nav aria-label="Prompts" className="min-w-0">
          <ul className="space-y-1.5">
            {prompts.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(x.id);
                    if (window.matchMedia('(max-width: 767px)').matches) setPhoneOpen(true);
                  }}
                  aria-current={x.id === selectedId ? 'true' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${x.id === selectedId ? 'border-teal bg-teal-soft' : 'border-line bg-surface hover:border-teal'}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow">{x.category}</span>
                    <span className="block text-[15px] font-semibold">{x.title}</span>
                    <span className="block text-[13px] text-slate md:hidden">{x.description}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-teal md:hidden" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden min-w-0 md:block">{editor}</div>

        <aside className="min-w-0 space-y-3 md:col-span-2 min-[1440px]:col-span-1">
          <section className="card p-4 text-[14px]">
            <h2 className="text-[15px] font-semibold">How to use</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Edit the fields to match your goal.</li>
              <li>Copy the prompt and open your AI assistant.</li>
              <li>Attach the relevant position statement PDF for exact numbers.</li>
              <li>Cross-check important answers with a second model.</li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              {destinations.map((d) => (
                <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" className="chip">
                  {d.label} <ExternalLink size={12} aria-label="(opens in a new tab)" />
                </a>
              ))}
            </div>
          </section>
          <section className="card p-4 text-[14px]">
            <h2 className="text-[15px] font-semibold">Reference index</h2>
            <p className="mt-1 text-slate">Citations and links for the sources these prompts rely on. We link to sources rather than redistributing copyrighted documents.</p>
            <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={exportManifest}>
              <FileText size={16} aria-hidden /> Download (.md)
            </button>
          </section>
        </aside>
      </div>

      {/* Phone: full-height preview sheet */}
      {phoneOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--page)] md:hidden" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
          <div className="flex h-[56px] items-center gap-2 border-b border-line bg-surface px-3">
            <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-sage" aria-label="Close" onClick={() => setPhoneOpen(false)}>
              <X size={22} aria-hidden />
            </button>
            <h2 id="sheet-title" className="min-w-0 flex-1 truncate text-[16px] font-semibold">{p.title}</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">{editor}</div>
        </div>
      )}
    </div>
  );
}

function PromptEditor({
  p, vals, filled, onChange, onCopy, onReset, onExport
}: {
  p: PromptTemplate;
  vals: Record<string, string>;
  filled: string;
  onChange: (k: string, v: string) => void;
  onCopy: () => void;
  onReset: () => void;
  onExport: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <p className="text-[14px] text-slate">{p.description}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {p.variables.map((v) => (
            <div key={v.key} className="min-w-0">
              <label htmlFor={`v-${p.id}-${v.key}`} className="text-[13px] font-semibold">{v.label}</label>
              <input id={`v-${p.id}-${v.key}`} className="input mt-1" value={vals[v.key] ?? ''} onChange={(e) => onChange(v.key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sage px-4 py-2">
          <span className="text-[13px] font-semibold">Preview</span>
          <span className="meta">{filled.length.toLocaleString()} characters</span>
        </div>
        <pre className="max-h-[52vh] overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-sans text-[14px] leading-relaxed">{filled}</pre>
      </div>
      <div className="sticky bottom-0 flex flex-wrap gap-2 bg-[var(--page)] py-2">
        <button type="button" className="btn btn-primary flex-1 sm:flex-none" onClick={onCopy}><Copy size={18} aria-hidden /> Copy prompt</button>
        <button type="button" className="btn btn-secondary" onClick={onExport}><Download size={18} aria-hidden /> .md</button>
        <button type="button" className="btn btn-ghost" onClick={onReset}><RotateCcw size={18} aria-hidden /> Reset</button>
      </div>
    </div>
  );
}
