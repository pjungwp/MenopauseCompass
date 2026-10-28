import { useMemo, useState } from 'react';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { questions, moduleById, facts } from '@/content';
import type { QuestionItem } from '@/content';
import { validateContent } from '@/lib/validation';
import { downloadFile } from '@/lib/format';
import { PageTitle } from '@/components/ui/primitives';
import { Rationale } from './academy/practice';
import { usePageTitle } from '@/lib/usePageTitle';

/**
 * DEV-ONLY clinical review queue (route exists only in `npm run dev`).
 * Mark items verified, then download questions.json and replace src/content/questions.json.
 */
export function EditorPage() {
  usePageTitle('Review queue (dev)');
  const [items, setItems] = useState<QuestionItem[]>(() => questions.map((q) => ({ ...q })));
  const [reviewer, setReviewer] = useState('Weiping Lin, DO');
  const [filter, setFilter] = useState<'draft' | 'verified' | 'all'>('draft');
  const issues = useMemo(() => validateContent(), []);
  const shown = items.filter((q) => filter === 'all' || q.status === filter);
  const today = new Date().toISOString().slice(0, 10);

  const setStatus = (id: string, status: QuestionItem['status']) =>
    setItems((xs) => xs.map((q) => (q.id === id ? { ...q, status, verifier: status === 'verified' ? reviewer : null, reviewedAt: status === 'verified' ? today : null } : q)));

  return (
    <div className="page-pad container-academy py-6">
      <PageTitle eyebrow="Development only" title="Clinical review queue">
        Changes stay in memory until you download the JSON and replace <code>src/content/questions.json</code>.
      </PageTitle>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-[14px] font-semibold">
          Reviewer
          <input className="input mt-1 w-[260px]" value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
        </label>
        <div className="flex gap-2">
          {(['draft', 'verified', 'all'] as const).map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => downloadFile('questions.json', JSON.stringify(items, null, 2) + '\n')}>
          <Download size={18} aria-hidden /> Download questions.json
        </button>
      </div>
      <p className="meta mt-2">
        {items.filter((q) => q.status === 'verified').length}/{items.length} items verified · {facts.filter((f) => f.status === 'reviewed').length}/{facts.length} facts reviewed (edit src/content/facts.ts)
      </p>
      {issues.length > 0 && (
        <div className="mt-3 rounded-xl bg-terra-soft p-3 text-[14px]">
          <p className="flex items-center gap-2 font-semibold text-terra"><AlertTriangle size={16} aria-hidden /> {issues.length} content issues</p>
          <ul className="mt-1 list-disc pl-5">{issues.slice(0, 20).map((i, n) => <li key={n}>{i.level}: {i.where} — {i.message}</li>)}</ul>
        </div>
      )}
      <ul className="mt-5 space-y-4">
        {shown.map((q) => (
          <li key={q.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="meta">{q.id} · M{moduleById[q.moduleId]?.number} · {q.difficulty} · {q.status}</p>
              <div className="flex gap-2">
                {q.status !== 'verified' ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setStatus(q.id, 'verified')}><CheckCircle2 size={16} aria-hidden /> Verify</button>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => setStatus(q.id, 'draft')}>Revert to draft</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setStatus(q.id, 'retired')}>Retire</button>
              </div>
            </div>
            <p className="mt-2 text-[15px] font-medium">{q.stem}</p>
            <ol className="mt-2 space-y-1 text-[14px]">
              {q.choices.map((c, i) => (
                <li key={c.id} className={c.id === q.correctChoiceId ? 'font-semibold text-ok' : ''}>{'ABCDE'[i]}. {c.text}{c.id === q.correctChoiceId ? ' ✓' : ''}</li>
              ))}
            </ol>
            <div className="mt-3"><Rationale q={q} selected={null} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
