import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Upload, Trash2, AlertTriangle, BookOpen, Lock } from 'lucide-react';
import { moduleById, questionById } from '@/content';
import { moduleStats, trapTagCounts, weakModuleIds } from '@/lib/quiz';
import { clearProgress, exportProgress, importProgress, parseImport } from '@/lib/storage';
import { downloadFile, formatDate, plural } from '@/lib/format';
import { Callout, EmptyState, PageTitle } from '@/components/ui/primitives';
import { useToast } from '@/components/ui/Toast';
import { usePageTitle } from '@/lib/usePageTitle';
import { useProgress } from './useProgress';
import { modeLabel } from './practice';

/* ═════════════ A09 — Progress ═════════════ */
export function ProgressPage() {
  usePageTitle('Progress');
  const { attempts, sessions, loading, error, reload } = useProgress();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [includeDemo, setIncludeDemo] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);

  const counted = includeDemo ? attempts : attempts.filter((a) => a.scored);
  const stats = moduleStats(counted);
  const weak = weakModuleIds(counted);
  const correct = counted.filter((a) => a.correct).length;
  const traps = trapTagCounts(counted, questionById).slice(0, 6);
  const recentErrors = [...counted].filter((a) => !a.correct).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const completed = sessions.filter((s) => s.completedAt);

  const doExport = async () => {
    try {
      const b = await exportProgress();
      downloadFile(`menopause-compass-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(b, null, 2));
      toast('Progress exported');
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  };
  const doImport = async (file: File) => {
    setImportError(null);
    try {
      const bundle = parseImport(await file.text());
      const r = await importProgress(bundle);
      toast(`Imported ${plural(r.attempts, 'answer')}`);
      reload();
    } catch (e) {
      setImportError((e as Error).message);
    }
  };
  const doClear = async () => {
    if (!window.confirm('Delete all practice history from this device? Export first if you want a backup.')) return;
    try {
      await clearProgress();
      toast('Progress cleared');
      reload();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  };

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow="MSCP Academy" title="Progress" />
      <p className="mt-2 flex items-start gap-2 text-[14px] text-slate">
        <Lock size={15} className="mt-0.5 shrink-0" aria-hidden /> Stored only in this browser (IndexedDB). No account, no cloud copy. Export to move between devices.
      </p>

      {error && (
        <div className="mt-4">
          <Callout tone="error" title="Saved progress couldn't be read">
            {error} You can reset local data below, or export what's readable first.
          </Callout>
        </div>
      )}

      {loading ? (
        <div className="mt-5 h-40 animate-pulse rounded-xl bg-sage" aria-label="Loading progress" />
      ) : counted.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No practice yet" action={<Link className="btn btn-primary" to="/academy/practice/setup">Start practicing</Link>}>
            <p>Answer a few questions and your strengths and weak spots will appear here.</p>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="grid flex-1 grid-cols-3 gap-3 sm:max-w-[560px]">
              <Metric label="Questions" value={String(counted.length)} />
              <Metric label="Correct" value={`${Math.round((correct / counted.length) * 100)}%`} />
              <Metric label="Active modules" value={`${stats.filter((s) => s.answered).length}/10`} />
            </div>
            <label className="flex min-h-[44px] items-center gap-2 text-[14px]">
              <input type="checkbox" className="h-5 w-5 accent-[var(--teal)]" checked={includeDemo} onChange={(e) => setIncludeDemo(e.target.checked)} />
              Include unscored demo answers
            </label>
          </div>
          <p className="meta mt-2">Based on {plural(counted.length, 'answer')} across {plural(completed.length, 'session')}. This does not estimate your chance of passing the MSCP exam.</p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {weak.length > 0 && (
              <section className="card p-4 lg:col-span-2" aria-labelledby="weak-h">
                <h2 id="weak-h" className="flex items-center gap-2 text-[16px] font-semibold"><AlertTriangle size={18} className="text-terra" aria-hidden /> Focus next</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {weak.map((id) => (
                    <li key={id}>
                      <Link to={`/academy/review/${moduleById[id].slug}`} className="chip"><BookOpen size={14} aria-hidden /> {moduleById[id].number}. {moduleById[id].title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="card p-4" aria-labelledby="mod-h">
              <h2 id="mod-h" className="text-[16px] font-semibold">Strength by module</h2>
              <ul className="mt-3 space-y-3">
                {stats.map((s) => (
                  <li key={s.moduleId}>
                    <div className="flex justify-between gap-2 text-[14px]">
                      <span className="min-w-0 truncate">{s.number}. {s.title}</span>
                      <span className="tabular shrink-0 text-slate">{s.answered ? `${s.pct}% (${s.correct}/${s.answered})` : 'Not started'}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage" aria-hidden>
                      {s.pct != null && <div className="h-full rounded-full" style={{ width: `${Math.max(s.pct, 3)}%`, background: s.pct >= 70 ? 'var(--ok)' : 'var(--terra-ui)' }} />}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="min-w-0 space-y-5">
              <section className="card p-4" aria-labelledby="err-h">
                <h2 id="err-h" className="text-[16px] font-semibold">Recent errors</h2>
                {recentErrors.length === 0 ? (
                  <p className="mt-2 text-[14px] text-slate">No recent misses.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-[14px]">
                    {recentErrors.map((a) => (
                      <li key={a.id} className="border-b border-line pb-2 last:border-0">
                        <p className="line-clamp-2">{questionById[a.questionId]?.stem ?? a.questionId}</p>
                        <p className="meta mt-0.5">M{moduleById[a.moduleTags[0]]?.number} · {formatDate(a.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {traps.length > 0 && (
                <section className="card p-4" aria-labelledby="trap-h">
                  <h2 id="trap-h" className="text-[16px] font-semibold">Trap tags you've missed</h2>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {traps.map((t) => <li key={t.tag} className="badge bg-terra-soft text-terra">{t.tag} × {t.count}</li>)}
                  </ul>
                </section>
              )}
              <section className="card p-4" aria-labelledby="sess-h">
                <h2 id="sess-h" className="text-[16px] font-semibold">Sessions</h2>
                <ul className="mt-2 space-y-1.5 text-[14px]">
                  {completed.slice(0, 6).map((s) => (
                    <li key={s.sessionId}>
                      <Link to={`/academy/practice/results/${s.sessionId}`} className="flex justify-between gap-2">
                        <span>{modeLabel(s.mode)} · {s.questionIds.length} q</span>
                        <span className="tabular text-slate">{formatDate(s.completedAt!)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </>
      )}

      <section className="card mt-6 p-4" aria-labelledby="data-h">
        <h2 id="data-h" className="text-[16px] font-semibold">Your data</h2>
        <p className="mt-1 text-[14px] text-slate">Export creates a JSON file you can import on another device or browser. Clearing deletes history from this browser only.</p>
        {importError && <div className="mt-3"><Callout tone="error">{importError}</Callout></div>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={doExport}><Download size={18} aria-hidden /> Export JSON</button>
          <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}><Upload size={18} aria-hidden /> Import</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Import progress file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = '';
            }}
          />
          <button type="button" className="btn btn-danger" onClick={doClear}><Trash2 size={18} aria-hidden /> Clear data</button>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="tabular text-[22px] font-bold">{value}</p>
      <p className="text-[13px] text-slate">{label}</p>
    </div>
  );
}
