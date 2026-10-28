import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenCheck, ListChecks, Bot, BadgeCheck, ArrowRight, Play, Sparkles, AlertTriangle, LineChart, CalendarClock } from 'lucide-react';
import { modules, moduleById, questions, certification, isCertificationStale, CONTENT_RELEASE } from '@/content';
import { ALLOW_DEMO_MODE } from '@/config';
import { DEFAULT_CONFIG, moduleStats, weakModuleIds } from '@/lib/quiz';
import { safeLocal } from '@/lib/storage';
import { formatDate, relativeDay, plural } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useProgress } from './useProgress';
import { createSession, loadActive } from './sessionStore';

export const LAST_MODULE_KEY = 'mc.lastModule';

/* ═════════════ A01 — Dashboard ═════════════ */
export function AcademyDashboard() {
  usePageTitle('MSCP Academy');
  const navigate = useNavigate();
  const { attempts, sessions, loading, error } = useProgress();
  const [starting, setStarting] = useState(false);
  const last = safeLocal.get<{ slug: string; at: string } | null>(LAST_MODULE_KEY, null);
  const lastModule = last ? modules.find((m) => m.slug === last.slug) : null;
  const active = loadActive();
  const verified = questions.filter((q) => q.status === 'verified').length;
  const isNew = !loading && attempts.length === 0 && !last;
  const weak = weakModuleIds(attempts).slice(0, 3);
  const stats = moduleStats(attempts);
  const answered = attempts.length;
  const pct = answered ? Math.round((attempts.filter((a) => a.correct).length / answered) * 100) : null;
  const lastSession = sessions.find((s) => s.completedAt);

  const quickStart = async () => {
    setStarting(true);
    const mode = verified >= 10 ? 'practice' : ALLOW_DEMO_MODE ? 'demo' : 'practice';
    const s = await createSession({ ...DEFAULT_CONFIG, mode, count: 10 }, attempts);
    setStarting(false);
    navigate(s ? '/academy/practice/session' : '/academy/practice/setup');
  };

  const continueHref = active ? '/academy/practice/session' : lastModule ? `/academy/review/${lastModule.slug}` : `/academy/review/${modules[0].slug}`;
  const continueTitle = active ? 'Resume your practice session' : lastModule ? `Continue: ${lastModule.title}` : 'Start with Module 1: Physiology & STRAW+10';
  const continueSub = active
    ? `Question ${active.index + 1} of ${active.questionIds.length}`
    : lastModule
      ? `Module ${lastModule.number} · last opened ${relativeDay(last!.at)}`
      : 'A one-minute review, then test yourself';

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-[22px] font-bold sm:text-[28px]">{isNew ? 'Welcome to MSCP Academy' : 'Welcome back'}</h1>
        <p className="meta">
          {lastSession ? <>Last studied {relativeDay(lastSession.completedAt!)}</> : 'Independent study resource · progress stays on this device'}
        </p>
      </div>

      {/* Primary actions */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Link to={continueHref} className="card-link flex min-h-[96px] items-center gap-4 p-4 sm:col-span-2 xl:col-span-1" style={{ background: 'var(--ink)', borderColor: 'var(--ink)' }}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(255,255,255,0.12)] text-white">
            {active ? <Play size={22} aria-hidden /> : <BookOpenCheck size={22} aria-hidden />}
          </span>
          <span className="min-w-0 flex-1 text-white">
            <span className="block text-[17px] font-semibold leading-snug">{continueTitle}</span>
            <span className="mt-0.5 block text-[14px] opacity-80">{continueSub}</span>
          </span>
          <ArrowRight size={20} className="shrink-0 text-white" aria-hidden />
        </Link>
        <button type="button" onClick={quickStart} disabled={starting} className="card-link flex min-h-[96px] items-center gap-3 p-4 text-left">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal"><ListChecks size={22} aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold">{starting ? 'Starting…' : 'Start 10 questions'}</span>
            <span className="block text-[13px] text-slate">{verified >= 10 ? 'Mixed topics · tutor mode' : 'Demo set · unscored drafts'}</span>
          </span>
        </button>
        <Link to="/academy/certification" className="card-link flex min-h-[96px] items-center gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lavender text-teal"><CalendarClock size={22} aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold">Next exam window</span>
            <span className="block text-[13px] text-slate">
              {isCertificationStale() ? 'Check the official site' : nextWindowText()}
            </span>
          </span>
        </Link>
      </div>

      {/* Module shortcuts */}
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { to: '/academy/certification', icon: BadgeCheck, title: 'Certification', sub: 'Steps & official links' },
          { to: '/academy/review', icon: BookOpenCheck, title: 'Quick Review', sub: '10 high-yield modules' },
          { to: '/academy/practice/setup', icon: ListChecks, title: 'Practice', sub: `${questions.length} items · ${verified} verified` },
          { to: '/academy/ai-toolkit', icon: Bot, title: 'AI Toolkit', sub: 'PROVE study prompts' }
        ].map((t) => (
          <li key={t.to}>
            <Link to={t.to} className="card-link flex h-full items-center gap-3 p-3.5">
              <t.icon size={20} className="shrink-0 text-teal" aria-hidden />
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold">{t.title}</span>
                <span className="block truncate text-[13px] text-slate">{t.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 lg:grid-cols-2 min-[1440px]:grid-cols-3">
        {/* Progress / weak topics */}
        <section className="card min-w-0 p-4" aria-labelledby="dash-progress">
          <div className="flex items-center justify-between gap-2">
            <h2 id="dash-progress" className="text-[16px] font-semibold">Your progress</h2>
            <Link to="/academy/progress" className="text-[14px] font-semibold">View progress</Link>
          </div>
          {error ? (
            <p className="mt-3 flex gap-2 text-[14px] text-terra"><AlertTriangle size={16} aria-hidden className="mt-0.5" /> {error}</p>
          ) : loading ? (
            <div className="mt-3 h-16 animate-pulse rounded-lg bg-sage" />
          ) : answered === 0 ? (
            <div className="mt-3 text-[14px] text-slate">
              <p>No questions answered yet. Pick a starting point:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/academy/review/${modules[0].slug}`} className="chip">Read Module 1</Link>
                <Link to="/academy/practice/setup" className="chip">Configure practice</Link>
                <Link to="/academy/certification" className="chip">Check eligibility</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="Answered" value={String(answered)} />
                <Mini label="Correct" value={`${pct}%`} />
                <Mini label="Modules" value={`${stats.filter((s) => s.answered).length}/10`} />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold">Recent weak topics</h3>
              {weak.length === 0 ? (
                <p className="mt-1 text-[14px] text-slate">None yet — weak topics appear after 3+ answers in a module below 70%.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {weak.map((id) => {
                    const m = moduleById[id];
                    const st = stats.find((s) => s.moduleId === id)!;
                    return (
                      <li key={id}>
                        <Link to={`/academy/review/${m.slug}`} className="flex items-center justify-between gap-2 rounded-lg bg-terra-soft px-3 py-2 text-[14px] font-medium text-ink no-underline">
                          <span className="truncate">{m.number}. {m.title}</span>
                          <span className="tabular shrink-0 text-terra">{st.pct}%</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Module strip */}
        <section className="card min-w-0 p-4" aria-labelledby="dash-modules">
          <div className="flex items-center justify-between gap-2">
            <h2 id="dash-modules" className="text-[16px] font-semibold">Review modules</h2>
            <Link to="/academy/review" className="text-[14px] font-semibold">All</Link>
          </div>
          <ul className="mt-2 divide-y divide-[var(--line)]">
            {modules.slice(0, 6).map((m) => {
              const st = stats.find((s) => s.moduleId === m.id);
              return (
                <li key={m.id}>
                  <Link to={`/academy/review/${m.slug}`} className="flex min-h-[44px] items-center gap-3 py-1.5 text-[14px] text-ink no-underline hover:no-underline">
                    <span className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-md bg-sage text-[13px] font-bold">{m.number}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">{m.title}</span>
                    {st?.pct != null && <span className="tabular text-[13px] text-slate">{st.pct}%</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Updates + caveat */}
        <section className="card min-w-0 p-4 lg:col-span-2 min-[1440px]:col-span-1" aria-labelledby="dash-updates">
          <h2 id="dash-updates" className="flex items-center gap-2 text-[16px] font-semibold"><Sparkles size={18} className="text-teal" aria-hidden /> Updated notes</h2>
          <ul className="mt-2 space-y-2.5 text-[14px]">
            <li><strong>FDA HT labeling (Nov 2025 / Feb 2026):</strong> CVD, breast cancer and dementia removed from the boxed warning. <Link to="/academy/review/systemic-hormone-therapy">Module 4</Link></li>
            <li><strong>Fezolinetant:</strong> hepatic boxed warning and monitoring schedule (Dec 2024). <Link to="/academy/review/nonhormone-therapy">Module 5</Link></li>
            <li><strong>Elinzanetant</strong> approved Oct 2025 (NK1/NK3). Not in the 2023 statement.</li>
            <li><strong>Exam format:</strong> 100 three-option items, 2 hours (2027 handbook).</li>
          </ul>
          <p className="meta mt-3">Content release {formatDate(CONTENT_RELEASE)} · {plural(questions.length, 'practice item')}. Independent resource — not affiliated with The Menopause Society.</p>
        </section>
      </div>

      <Link to="/academy/progress" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold md:hidden">
        <LineChart size={16} aria-hidden /> View progress
      </Link>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-sage px-2 py-2">
      <p className="tabular text-[18px] font-bold">{value}</p>
      <p className="text-[12px] text-slate">{label}</p>
    </div>
  );
}

export function nextWindowText(now = new Date()): string {
  const w = certification.testingWindows.find((x) => new Date(x.closes + 'T23:59:59') >= now);
  if (!w) return 'Check the official site';
  const deadlinePassed = new Date(w.applicationDeadline + 'T23:59:59') < now;
  return deadlinePassed ? `${w.label} (applications closed)` : `${w.label} · apply by ${formatDate(w.applicationDeadline, { month: 'short', day: 'numeric' })}`;
}
