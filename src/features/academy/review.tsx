import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle, Copy, Bookmark, BookmarkCheck, ListChecks, ArrowRight, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { modules, moduleBySlug, factById, questions } from '@/content';
import type { ReviewModule } from '@/content';
import { searchAcademy } from '@/lib/search';
import { DEFAULT_CONFIG } from '@/lib/quiz';
import { getBookmarks, safeLocal, setBookmarks } from '@/lib/storage';
import { Callout, EmptyState, PageTitle, StackedTable } from '@/components/ui/primitives';
import { ReviewStatusBadge, SourceBlock } from '@/components/source/SourceLabel';
import { copyText, useToast } from '@/components/ui/Toast';
import { usePageTitle } from '@/lib/usePageTitle';
import { useProgress } from './useProgress';
import { createSession } from './sessionStore';
import { LAST_MODULE_KEY } from './dashboard';
import { ALLOW_DEMO_MODE } from '@/config';

const categories = ['All', 'Foundations', 'Treatment', 'Organ systems', 'Special populations'] as const;

/* ═════════════ A03 — Quick Review index ═════════════ */
export function ReviewIndexPage() {
  usePageTitle('Quick Review');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [cat, setCat] = useState<(typeof categories)[number]>('All');
  const bookmarks = getBookmarks();

  const results = useMemo(() => (q.trim() ? searchAcademy(q, 25) : []), [q]);
  const list = modules.filter((m) => cat === 'All' || m.category === cat);
  const trapsCount = modules.reduce((s, m) => s + m.traps.length, 0);

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow="MSCP Academy" title="Quick Review" />

      {/* One-row toolbar: search + category filters */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          role="search"
          className="flex h-11 min-w-0 items-center rounded-xl border border-line-strong bg-surface lg:w-[380px] focus-within:border-teal"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search size={18} className="ml-3 shrink-0 text-slate" aria-hidden />
          <label htmlFor="rv-q" className="sr-only">Search review modules</label>
          <input
            id="rv-q"
            type="search"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] focus:outline-none"
            placeholder="Search modules, drugs, thresholds"
            value={q}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set('q', e.target.value);
              else next.delete('q');
              setParams(next, { replace: true });
            }}
          />
        </form>
        {!q && (
          <div className="scroll-x-chips" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {q ? (
        <section className="mt-5" aria-live="polite">
          <p className="meta">{results.length} results for “{q}”</p>
          {results.length === 0 ? (
            <div className="mt-3"><EmptyState title="No matches">Try a drug name, threshold or abbreviation (e.g. “DXA”, “Femring”, “CYP2D6”).</EmptyState></div>
          ) : (
            <ul className="mt-3 space-y-2">
              {results.map(({ doc }) => (
                <li key={doc.kind + doc.id}>
                  <Link to={doc.href} className="card-link block p-3.5">
                    <span className="eyebrow">{doc.kind === 'module' ? `Module ${doc.item.number}` : 'Key fact'}</span>
                    <span className="block text-[15px] font-semibold">{doc.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[14px] text-slate">{doc.kind === 'module' ? doc.item.blurb : doc.item.clinicianPearl}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <div className="mt-5 grid gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_300px]">
          {/* Phones: compact list rows; tablet+: cards */}
          <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {list.map((m) => (
              <li key={m.id}>
                <Link to={`/academy/review/${m.slug}`} className="card-link flex h-full min-h-[64px] items-center gap-3 p-3 sm:min-h-[150px] sm:flex-col sm:items-start sm:p-4">
                  <span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-soft text-[15px] font-bold text-teal">{m.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-snug sm:text-[16px]">{m.title}</span>
                    <span className="mt-0.5 hidden text-[13.5px] text-slate sm:line-clamp-2">{m.blurb}</span>
                  </span>
                  <span className="hidden w-full items-center justify-between gap-2 sm:mt-auto sm:flex">
                    <ReviewStatusBadge status={m.status} lastReviewed={m.lastReviewed} />
                    {bookmarks.includes(m.id) && <BookmarkCheck size={16} className="text-teal" aria-label="Bookmarked" />}
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-teal sm:hidden" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          {trapsCount > 0 && (
            <aside className="hidden min-[1440px]:block">
              <div className="card sticky top-[calc(var(--header-h)+16px)] p-4">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold"><AlertTriangle size={16} className="text-terra" aria-hidden /> Exam traps</h2>
                <ul className="mt-2 space-y-2 text-[13.5px]">
                  {modules.slice(0, 6).map((m) => (
                    <li key={m.id}>
                      <Link to={`/academy/review/${m.slug}#traps`} className="text-ink">{m.traps[0]}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

/* ═════════════ A04 — Review article ═════════════ */
export function ReviewArticlePage() {
  const { slug = '' } = useParams();
  const m = moduleBySlug[slug];
  const toast = useToast();
  const navigate = useNavigate();
  const { attempts } = useProgress();
  const [bookmarked, setBookmarked] = useState(() => (m ? getBookmarks().includes(m.id) : false));
  usePageTitle(m ? `Module ${m.number}: ${m.title}` : 'Module not found');

  useEffect(() => {
    if (m) safeLocal.set(LAST_MODULE_KEY, { slug: m.slug, at: new Date().toISOString() });
    setBookmarked(m ? getBookmarks().includes(m.id) : false);
  }, [m]);

  if (!m)
    return (
      <div className="page-pad mx-auto max-w-[720px] py-10">
        <EmptyState title="Module not found" action={<Link className="btn btn-primary" to="/academy/review">All modules</Link>} />
      </div>
    );

  const idx = modules.indexOf(m);
  const prev = modules[idx - 1];
  const next = modules[idx + 1];
  const moduleQs = questions.filter((q) => q.moduleId === m.id);
  const verifiedQs = moduleQs.filter((q) => q.status === 'verified').length;

  const toggleBookmark = () => {
    const cur = getBookmarks();
    const nextList = cur.includes(m.id) ? cur.filter((x) => x !== m.id) : [...cur, m.id];
    setBookmarks(nextList);
    setBookmarked(nextList.includes(m.id));
    toast(nextList.includes(m.id) ? 'Bookmarked' : 'Bookmark removed');
  };

  const testMe = async () => {
    const mode = verifiedQs >= 1 ? 'practice' : ALLOW_DEMO_MODE ? 'demo' : 'practice';
    const s = await createSession({ ...DEFAULT_CONFIG, mode, moduleIds: [m.id], count: 5 }, attempts);
    navigate(s ? '/academy/practice/session' : '/academy/practice/setup');
  };

  const copyPearl = async (text: string) => toast((await copyText(text)) ? 'Pearl copied' : 'Could not copy');

  return (
    <div className="page-pad container-academy py-5 sm:py-6 pb-[calc(96px+var(--safe-bottom))] md:pb-6">
      <nav aria-label="Breadcrumb" className="meta">
        <Link to="/academy/review">Quick Review</Link> <span aria-hidden>/</span> Module {m.number}
      </nav>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[22px] font-bold sm:text-[26px]">
          <span className="text-teal">{m.number}.</span> {m.title}
        </h1>
        <div className="flex gap-2">
          <ReviewStatusBadge status={m.status} lastReviewed={m.lastReviewed} />
          <button type="button" className="btn btn-ghost btn-sm" aria-pressed={bookmarked} onClick={toggleBookmark}>
            {bookmarked ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />} {bookmarked ? 'Saved' : 'Bookmark'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <article className="min-w-0 space-y-6">
          <section aria-labelledby="one-min" className="rounded-xl border border-line bg-surface p-4 sm:p-5" style={{ borderLeft: '4px solid var(--teal)' }}>
            <h2 id="one-min" className="text-[16px] font-semibold">One-minute review</h2>
            <ul className="mt-2 space-y-2 text-[15px]">
              {m.oneMinute.map((b, i) => (
                <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden />{b}</li>
              ))}
            </ul>
          </section>

          {m.traps.length > 0 && (
            <section id="traps" aria-labelledby="traps-h" className="scroll-mt-24">
              <h2 id="traps-h" className="flex items-center gap-2 text-[16px] font-semibold"><AlertTriangle size={18} className="text-terra" aria-hidden /> Exam traps</h2>
              <ul className="mt-2 space-y-2">
                {m.traps.map((t) => (
                  <li key={t} className="flex gap-2 rounded-lg bg-terra-soft px-3 py-2 text-[15px]">
                    <span className="font-semibold text-terra">Trap:</span> <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {m.decisionRules.length > 0 && (
            <section aria-labelledby="rules-h">
              <h2 id="rules-h" className="text-[16px] font-semibold">Decision rules</h2>
              <ul className="mt-2 space-y-1.5 text-[15px]">
                {m.decisionRules.map((d) => <li key={d} className="flex gap-2"><ArrowRight size={16} className="mt-1 shrink-0 text-teal" aria-hidden />{d}</li>)}
              </ul>
            </section>
          )}

          {m.tables.map((t) => <StackedTable key={t.title} title={t.title} columns={t.columns} rows={t.rows} />)}

          <section aria-labelledby="pearls-h">
            <h2 id="pearls-h" className="flex items-center gap-2 text-[16px] font-semibold"><Lightbulb size={18} className="text-teal" aria-hidden /> Pearls</h2>
            <ul className="mt-2 space-y-2">
              {m.pearls.map((p) => (
                <li key={p.text} className="flex items-start justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[15px]">
                  <span className="min-w-0">{p.text}</span>
                  <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate hover:bg-sage" aria-label="Copy pearl" onClick={() => copyPearl(p.text)}>
                    <Copy size={16} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="facts-h">
            <h2 id="facts-h" className="text-[16px] font-semibold">Key facts</h2>
            <p className="meta mt-0.5">Statement-derived content. Expand for detail and patient-language version.</p>
            <ul className="mt-2 space-y-2">
              {m.factIds.map((id) => {
                const f = factById[id];
                if (!f) return null;
                return (
                  <li key={id} id={id} className="card scroll-mt-24 px-4">
                    <details>
                      <summary className="cursor-pointer list-none py-3">
                        <span className="block text-[15px] font-semibold">{f.title}</span>
                        <span className="mt-0.5 block text-[14px]">{f.clinicianPearl}</span>
                      </summary>
                      <div className="space-y-2 pb-4 text-[14px]">
                        <p>{f.expandedExplanation}</p>
                        <p className="rounded-lg bg-sage px-3 py-2"><span className="font-semibold">How patients hear it: </span>{f.shortPatientAnswer}</p>
                        {f.examTraps.length > 0 && <p className="text-terra"><span className="font-semibold">Trap: </span>{f.examTraps.join(' ')}</p>}
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          </section>

          {m.interpretiveNotes.length > 0 && (
            <Callout tone="info" title="Editorial notes (interpretive, not stated in sources)">
              <ul className="list-disc space-y-1 pl-5">{m.interpretiveNotes.map((n) => <li key={n}>{n}</li>)}</ul>
            </Callout>
          )}

          <SourceBlock factIds={m.factIds} extraRefs={m.references} audience="academy" />

          <nav className="flex justify-between gap-3" aria-label="Module navigation">
            {prev ? <Link to={`/academy/review/${prev.slug}`} className="btn btn-secondary"><ChevronLeft size={16} aria-hidden /> {prev.number}. <span className="hidden sm:inline">{prev.title}</span></Link> : <span />}
            {next && <Link to={`/academy/review/${next.slug}`} className="btn btn-secondary">{next.number}. <span className="hidden sm:inline">{next.title}</span> <ChevronRight size={16} aria-hidden /></Link>}
          </nav>
        </article>

        {/* Utility rail — folds into a sticky action on phones */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+16px)] space-y-3">
            <div className="card p-4">
              <h2 className="text-[15px] font-semibold">Test yourself</h2>
              <p className="meta mt-0.5">{moduleQs.length} items in this module{verifiedQs < moduleQs.length ? ` · ${moduleQs.length - verifiedQs} draft` : ''}</p>
              <button type="button" className="btn btn-primary mt-3 w-full" onClick={testMe} disabled={moduleQs.length === 0}>
                <ListChecks size={18} aria-hidden /> Test me (5)
              </button>
            </div>
            <nav className="card p-4" aria-label="In this module">
              <p className="eyebrow mb-2">Outline</p>
              <ul className="space-y-1.5 text-[14px]">
                <li><a href="#one-min">One-minute review</a></li>
                <li><a href="#traps">Exam traps</a></li>
                <li><a href="#pearls-h">Pearls</a></li>
                <li><a href="#facts-h">Key facts</a></li>
                <li><a href="#sources-h">Sources</a></li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>

      <MobileTestBar m={m} onTest={testMe} />
    </div>
  );
}

function MobileTestBar({ m, onTest }: { m: ReviewModule; onTest: () => void }) {
  return (
    <div className="above-bottom-nav fixed inset-x-0 z-30 border-t border-line bg-surface px-4 py-2.5 lg:hidden">
      <button type="button" className="btn btn-primary w-full" onClick={onTest}>
        <ListChecks size={18} aria-hidden /> 5 questions on Module {m.number}
      </button>
    </div>
  );
}
