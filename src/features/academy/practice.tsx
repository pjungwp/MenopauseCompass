import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Flag, X, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Timer, Play, FlaskConical, RotateCcw, BookOpen, Download, ListChecks
} from 'lucide-react';
import { modules, moduleById, questionById, questions } from '@/content';
import type { Difficulty, QuestionItem } from '@/content';
import { ALLOW_DEMO_MODE } from '@/config';
import { availableCount, DEFAULT_CONFIG, formatDuration, isValidItem, weakModuleIds, type SessionConfig } from '@/lib/quiz';
import { CONTENT_VERSION } from '@/content';
import { getAttemptsForSession, getAllSessions, saveAttempt, saveSession, type Attempt, type PracticeMode, type SessionRecord } from '@/lib/storage';
import { Callout, EmptyState, PageTitle, Segmented } from '@/components/ui/primitives';
import { downloadFile, plural } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useProgress } from './useProgress';
import { clearActive, createSession, loadActive, saveActive, type ActiveSession } from './sessionStore';
import { sourceById } from '@/content';

const verifiedTotal = questions.filter((q) => q.status === 'verified').length;

/* ═════════════ A05 — Setup ═════════════ */
export function PracticeSetupPage() {
  usePageTitle('Practice setup');
  const navigate = useNavigate();
  const { attempts, loading } = useProgress();
  const resumable = loadActive();
  const [config, setConfig] = useState<SessionConfig>(() => ({
    ...DEFAULT_CONFIG,
    mode: verifiedTotal > 0 ? 'practice' : ALLOW_DEMO_MODE ? 'demo' : 'practice'
  }));
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = useMemo(() => availableCount(config, attempts), [config, attempts]);
  const weakIds = useMemo(() => weakModuleIds(attempts), [attempts]);
  const effectiveCount = Math.min(config.count, available);
  const set = <K extends keyof SessionConfig>(k: K, v: SessionConfig[K]) => setConfig((c) => ({ ...c, [k]: v }));

  const start = async () => {
    setStarting(true);
    setError(null);
    const s = await createSession({ ...config, timed: config.mode === 'timed' || config.timed }, attempts);
    setStarting(false);
    if (!s) {
      setError('No eligible questions match these settings.');
      return;
    }
    navigate('/academy/practice/session');
  };

  const modeOptions: { value: PracticeMode; label: string; hint: string }[] = [
    { value: 'practice', label: 'Tutor', hint: 'Feedback after each question' },
    { value: 'timed', label: 'Timed exam', hint: 'Feedback at the end; 72 s per item like the real exam' },
    { value: 'weak', label: 'Weak areas', hint: 'Your missed items and weakest modules' },
    ...(ALLOW_DEMO_MODE ? [{ value: 'demo' as PracticeMode, label: 'Demo (unscored)', hint: 'Draft items awaiting clinical review' }] : [])
  ];

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow="MSCP Academy · Practice" title="Set up a practice session">
        Progress is saved only on this device.
      </PageTitle>

      {resumable && (
        <div className="mt-4">
          <Callout tone="info" title="You have a session in progress">
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span>
                Question {resumable.index + 1} of {resumable.questionIds.length} · {modeLabel(resumable.config.mode)}
              </span>
              <Link to="/academy/practice/session" className="btn btn-primary btn-sm">Resume</Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { clearActive(); window.location.reload(); }}>Discard</button>
            </div>
          </Callout>
        </div>
      )}

      {verifiedTotal === 0 && (
        <div className="mt-4">
          <Callout tone="caution" title="Scored practice opens after clinical verification">
            All {questions.length} items are AI-drafted and awaiting clinician review, so scored modes are locked.
            Demo mode lets you try every feature with draft items; results are clearly marked unscored.
          </Callout>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="card min-w-0 space-y-6 p-4 sm:p-5">
          <Segmented name="mode" label="Mode" value={config.mode} onChange={(v) => set('mode', v)} options={modeOptions} />
          <p className="-mt-3 text-[13px] text-slate">{modeOptions.find((m) => m.value === config.mode)?.hint}</p>

          <fieldset className="min-w-0">
            <legend className="mb-2 text-[14px] font-semibold">Topics</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="chip" aria-pressed={config.moduleIds.length === 0} onClick={() => set('moduleIds', [])}>All modules</button>
              {modules.map((m) => {
                const on = config.moduleIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    className="chip"
                    aria-pressed={on}
                    onClick={() => set('moduleIds', on ? config.moduleIds.filter((x) => x !== m.id) : [...config.moduleIds, m.id])}
                  >
                    {m.number}. {m.title}
                    {weakIds.includes(m.id) && <span className="badge bg-terra-soft text-terra">weak</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Segmented<number>
            name="count"
            label="Number of questions"
            value={config.count}
            onChange={(v) => set('count', v)}
            options={[5, 10, 25, 50].map((n) => ({ value: n, label: String(n) }))}
          />
          <Segmented<Difficulty | 'mixed'>
            name="difficulty"
            label="Difficulty"
            value={config.difficulty}
            onChange={(v) => set('difficulty', v)}
            options={[
              { value: 'mixed', label: 'Mixed' },
              { value: 'recall', label: 'Recall' },
              { value: 'application', label: 'Application' },
              { value: 'analysis', label: 'Analysis' }
            ]}
          />
          {config.mode !== 'timed' && (
            <label className="flex min-h-[44px] items-center gap-3 text-[15px]">
              <input type="checkbox" className="h-5 w-5 accent-[var(--teal)]" checked={config.timed} onChange={(e) => set('timed', e.target.checked)} />
              Add a timer (72 seconds per question, matching the real exam pace)
            </label>
          )}
        </div>

        <aside className="min-w-0">
          <div className="card sticky top-[calc(var(--header-h)+16px)] p-4 sm:p-5">
            <h2 className="text-[16px] font-semibold">Session summary</h2>
            <dl className="mt-3 space-y-2 text-[15px]">
              <Row k="Mode" v={modeLabel(config.mode)} />
              <Row k="Topics" v={config.moduleIds.length ? config.moduleIds.map((id) => moduleById[id]?.number).join(', ') : 'All 10 modules'} />
              <Row k="Questions" v={loading ? '…' : `${effectiveCount} of ${config.count} requested`} />
              <Row k="Timer" v={config.mode === 'timed' || config.timed ? formatDuration(effectiveCount * config.secondsPerQuestion) : 'Off'} />
              <Row k="Scoring" v={config.mode === 'demo' ? 'Unscored demo' : 'Scored, saved locally'} />
            </dl>
            <p className="meta mt-3" aria-live="polite">
              {available === 0
                ? 'No verified questions match these settings.'
                : available < config.count
                  ? `Only ${plural(available, 'question')} available for these settings.`
                  : `${plural(available, 'question')} available.`}
            </p>
            {error && <p className="mt-2 text-[14px] text-err" role="alert">{error}</p>}
            <button type="button" className="btn btn-primary mt-4 w-full" disabled={available === 0 || starting} onClick={start}>
              <Play size={18} aria-hidden /> {starting ? 'Starting…' : 'Start session'}
            </button>
            <p className="meta mt-3">The real MSCP exam: 100 three-option items in 2 hours. Practice items here are independent and not official exam content.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate">{k}</dt>
      <dd className="m-0 text-right font-medium">{v}</dd>
    </div>
  );
}

export function modeLabel(m: PracticeMode) {
  return { practice: 'Tutor', timed: 'Timed exam', weak: 'Weak areas', demo: 'Demo (unscored)' }[m];
}

/* ═════════════ A06 — Question session ═════════════ */
export function PracticeSessionPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ActiveSession | null>(() => loadActive());
  const [now, setNow] = useState(Date.now());
  const questionStart = useRef(Date.now());
  const [saveError, setSaveError] = useState(false);
  const finishing = useRef(false);
  usePageTitle(session ? `Question ${session.index + 1} of ${session.questionIds.length}` : 'Practice session');

  const qid = session?.questionIds[session.index];
  const q: QuestionItem | undefined = qid ? questionById[qid] : undefined;
  const ans = qid && session ? session.answers[qid] : undefined;
  const isTimedExam = session?.config.mode === 'timed';
  const showFeedback = !!ans?.submitted && !isTimedExam;

  const update = useCallback((fn: (s: ActiveSession) => ActiveSession) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      saveActive(next);
      return next;
    });
  }, []);

  // reset per-question timer when question changes
  useEffect(() => {
    questionStart.current = Date.now();
  }, [session?.index]);

  const accrueTime = useCallback(() => {
    if (!qid) return;
    const delta = Math.round((Date.now() - questionStart.current) / 1000);
    questionStart.current = Date.now();
    update((s) => ({ ...s, answers: { ...s.answers, [qid]: { ...s.answers[qid], seconds: s.answers[qid].seconds + delta } } }));
  }, [qid, update]);

  const finish = useCallback(async () => {
    if (!session || finishing.current) return;
    finishing.current = true;
    const delta = qid ? Math.round((Date.now() - questionStart.current) / 1000) : 0;
    const completedAt = new Date().toISOString();
    try {
      for (const id of session.questionIds) {
        const a = session.answers[id];
        const item = questionById[id];
        if (!item) continue;
        // Tutor-mode attempts were saved on submit; timed mode saves all now. Unanswered items count as incorrect in timed mode only.
        if (session.config.mode === 'timed' || !a.submitted) {
          if (session.config.mode !== 'timed' && !a.selected) continue;
          await saveAttempt(makeAttempt(session, item, a, id === qid ? a.seconds + delta : a.seconds));
        }
      }
      await saveSession(toRecord(session, completedAt));
    } catch {
      setSaveError(true);
    }
    clearActive();
    navigate(`/academy/practice/results/${session.sessionId}`, { replace: true });
  }, [session, qid, navigate]);

  // countdown
  useEffect(() => {
    if (!session?.deadline) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [session?.deadline]);
  const remaining = session?.deadline ? Math.max(0, Math.round((session.deadline - now) / 1000)) : null;
  useEffect(() => {
    if (remaining === 0) void finish();
  }, [remaining, finish]);

  const select = (choiceId: string) => {
    if (!qid || !ans || showFeedback) return;
    update((s) => ({ ...s, answers: { ...s.answers, [qid]: { ...s.answers[qid], selected: choiceId } } }));
  };

  const submit = async () => {
    if (!qid || !ans?.selected || !q || !session) return;
    const delta = Math.round((Date.now() - questionStart.current) / 1000);
    questionStart.current = Date.now();
    const updated: AnswerState2 = { ...ans, submitted: true, seconds: ans.seconds + delta };
    update((s) => ({ ...s, answers: { ...s.answers, [qid]: updated } }));
    if (!isTimedExam) {
      try {
        await saveAttempt(makeAttempt(session, q, updated, updated.seconds));
      } catch {
        setSaveError(true);
      }
    }
  };

  const go = (dir: 1 | -1) => {
    if (!session) return;
    accrueTime();
    const nextIndex = session.index + dir;
    if (nextIndex < 0) return;
    if (nextIndex >= session.questionIds.length) return void finish();
    update((s) => ({ ...s, index: nextIndex }));
  };

  const jump = (i: number) => {
    accrueTime();
    update((s) => ({ ...s, index: i }));
  };

  const toggleFlag = () => {
    if (!qid) return;
    update((s) => ({ ...s, answers: { ...s.answers, [qid]: { ...s.answers[qid], flagged: !s.answers[qid].flagged } } }));
  };

  // keyboard: A–E select, Enter submit/next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      const idx = 'abcde'.indexOf(k);
      if (idx >= 0 && idx < q.choices.length) {
        e.preventDefault();
        select(q.choices[idx].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!session || !q || !ans) {
    return (
      <div className="page-pad mx-auto max-w-[720px] py-10">
        <EmptyState title="No active session" action={<Link to="/academy/practice/setup" className="btn btn-primary">Set up practice</Link>}>
          <p>Start a new practice session to begin.</p>
        </EmptyState>
      </div>
    );
  }

  if (!isValidItem(q)) {
    return (
      <div className="page-pad mx-auto max-w-[720px] py-10">
        <Callout tone="error" title="This question can't be shown">
          Its answer key is missing or malformed, so it has been blocked and flagged for review.
          <div className="mt-2"><button className="btn btn-secondary btn-sm" onClick={() => go(1)}>Skip to next</button></div>
        </Callout>
      </div>
    );
  }

  const total = session.questionIds.length;
  const answeredCount = session.questionIds.filter((id) => session.answers[id].selected).length;
  const isLast = session.index === total - 1;
  const correct = ans.selected === q.correctChoiceId;
  const mod = moduleById[q.moduleId];

  return (
    <div className="flex min-h-[calc(100vh-var(--header-h))] flex-col">
      {/* Top bar: index, progress, timer, flag, quit */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-line bg-surface">
        <div className="page-pad mx-auto flex h-[52px] max-w-[1180px] items-center gap-3">
          <span className="tabular text-[15px] font-semibold">
            {session.index + 1}<span className="text-slate">/{total}</span>
          </span>
          <div className="h-1.5 min-w-[60px] flex-1 overflow-hidden rounded-full bg-sage" role="progressbar" aria-label="Session progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answeredCount}>
            <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${(answeredCount / total) * 100}%` }} />
          </div>
          {remaining !== null && (
            <span className={`tabular flex items-center gap-1 text-[15px] font-semibold ${remaining < 60 ? 'text-err' : ''}`} aria-live={remaining < 60 ? 'polite' : 'off'}>
              <Timer size={16} aria-hidden />
              <span className="sr-only">Time remaining </span>
              {formatDuration(remaining)}
            </span>
          )}
          <button type="button" onClick={toggleFlag} aria-pressed={ans.flagged} className={`grid h-10 w-10 place-items-center rounded-lg hover:bg-sage ${ans.flagged ? 'text-terra' : 'text-slate'}`} aria-label={ans.flagged ? 'Unflag question' : 'Flag question for review'}>
            <Flag size={18} aria-hidden fill={ans.flagged ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate hover:bg-sage"
            aria-label="Quit session"
            onClick={() => {
              if (window.confirm('End this session? Answers so far will be saved and scored.')) void finish();
            }}
          >
            <X size={20} aria-hidden />
          </button>
        </div>
      </div>

      {session.config.mode === 'demo' && (
        <div className="page-pad mx-auto mt-3 w-full max-w-[1180px]">
          <p className="flex items-center gap-2 rounded-lg bg-lavender px-3 py-2 text-[13px]">
            <FlaskConical size={14} className="text-teal" aria-hidden /> Demo item — drafted for clinical review; unscored.
          </p>
        </div>
      )}
      {saveError && (
        <div className="page-pad mx-auto mt-3 w-full max-w-[1180px]">
          <Callout tone="caution">Your browser blocked local saving. You can keep going; results may not appear in Progress.</Callout>
        </div>
      )}

      <div className="page-pad mx-auto w-full max-w-[1180px] flex-1 py-4 sm:py-6 pb-[calc(96px+var(--safe-bottom))]">
        <div className={`grid gap-5 ${showFeedback ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
          <div className="mx-auto w-full max-w-[900px] min-w-0">
            <p className="meta">Module {mod?.number}: {mod?.title} · {q.difficulty}</p>
            <h1 className="sr-only">Question {session.index + 1}</h1>
            <p className="mt-2 text-[16px] leading-relaxed sm:text-[17px]" id="stem">{q.stem}</p>

            <div className="mt-4 space-y-2.5" role="radiogroup" aria-labelledby="stem">
              {q.choices.map((c, i) => {
                const letter = 'ABCDE'[i];
                const chosen = ans.selected === c.id;
                const isCorrect = c.id === q.correctChoiceId;
                let style = 'border-line-strong bg-surface hover:border-teal';
                let icon = null;
                if (showFeedback) {
                  if (isCorrect) {
                    style = 'border-ok bg-ok-soft';
                    icon = <CheckCircle2 size={20} className="text-ok" aria-hidden />;
                  } else if (chosen) {
                    style = 'border-err bg-err-soft';
                    icon = <XCircle size={20} className="text-err" aria-hidden />;
                  } else style = 'border-line bg-surface opacity-80';
                } else if (chosen) style = 'border-teal bg-teal-soft ring-1 ring-teal';
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={chosen}
                    disabled={showFeedback}
                    onClick={() => select(c.id)}
                    className={`flex min-h-[52px] w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-[15.5px] transition-colors disabled:cursor-default ${style}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[14px] font-bold ${chosen && !showFeedback ? 'bg-teal text-white' : 'bg-sage text-ink'}`}>{letter}</span>
                    <span className="min-w-0 flex-1 pt-0.5">{c.text}</span>
                    {icon}
                    {showFeedback && (
                      <span className="sr-only">{isCorrect ? '(correct answer)' : chosen ? '(your answer, incorrect)' : ''}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite">
              {showFeedback && (
                <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-[16px] font-semibold ${correct ? 'bg-ok-soft text-ok' : 'bg-err-soft text-err'}`}>
                  {correct ? <CheckCircle2 size={20} aria-hidden /> : <XCircle size={20} aria-hidden />}
                  {correct ? 'Correct' : `Incorrect — the answer is ${'ABCDE'[q.choices.findIndex((c) => c.id === q.correctChoiceId)]}`}
                </div>
              )}
              {isTimedExam && ans.selected && <p className="meta mt-3">Answer recorded. Feedback appears when you finish.</p>}
            </div>
          </div>

          {showFeedback && (
            <aside className="mx-auto w-full max-w-[900px] min-w-0 xl:max-w-none">
              <Rationale q={q} selected={ans.selected} />
            </aside>
          )}
        </div>

        {/* Question navigator for timed/review */}
        {(isTimedExam || total > 1) && (
          <details className="mx-auto mt-6 max-w-[900px]">
            <summary className="cursor-pointer text-[14px] font-semibold text-teal">Question navigator</summary>
            <ol className="mt-3 flex flex-wrap gap-2">
              {session.questionIds.map((id, i) => {
                const a = session.answers[id];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === session.index ? 'step' : undefined}
                      aria-label={`Question ${i + 1}${a.selected ? ', answered' : ''}${a.flagged ? ', flagged' : ''}`}
                      className={`tabular relative grid h-11 w-11 place-items-center rounded-lg border text-[14px] font-semibold ${
                        i === session.index ? 'border-teal bg-teal text-white' : a.selected ? 'border-teal-soft bg-teal-soft' : 'border-line bg-surface'
                      }`}
                    >
                      {i + 1}
                      {a.flagged && <Flag size={10} className="absolute right-1 top-1 text-terra" fill="currentColor" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </details>
        )}
      </div>

      {/* Sticky action row */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="page-pad mx-auto flex max-w-[1180px] items-center gap-2 py-2.5">
          <button type="button" className="btn btn-secondary" onClick={() => go(-1)} disabled={session.index === 0} aria-label="Previous question">
            <ChevronLeft size={18} aria-hidden /> <span className="hidden sm:inline">Back</span>
          </button>
          <span className="meta hidden flex-1 text-center sm:block">Keys A–{'ABCDE'[q.choices.length - 1]} select</span>
          <span className="flex-1 sm:hidden" />
          {!isTimedExam && !ans.submitted ? (
            <button type="button" className="btn btn-primary min-w-[140px]" onClick={submit} disabled={!ans.selected}>
              Submit answer
            </button>
          ) : isLast ? (
            <button type="button" className="btn btn-primary min-w-[140px]" onClick={() => {
              if (isTimedExam && answeredCount < total && !window.confirm(`${total - answeredCount} unanswered. Finish anyway?`)) return;
              void finish();
            }}>
              Finish & see results
            </button>
          ) : (
            <button type="button" className="btn btn-primary min-w-[140px]" onClick={() => go(1)}>
              Next <ChevronRight size={18} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type AnswerState2 = ActiveSession['answers'][string];

function makeAttempt(s: ActiveSession, q: QuestionItem, a: AnswerState2, seconds: number): Attempt {
  return {
    id: `${s.sessionId}:${q.id}`,
    sessionId: s.sessionId,
    createdAt: new Date().toISOString(),
    mode: s.config.mode,
    questionId: q.id,
    selectedId: a.selected,
    correct: a.selected === q.correctChoiceId,
    durationSeconds: seconds,
    flagged: a.flagged,
    moduleTags: [q.moduleId],
    contentVersion: CONTENT_VERSION,
    scored: s.scored
  };
}

function toRecord(s: ActiveSession, completedAt: string): SessionRecord {
  return {
    sessionId: s.sessionId,
    createdAt: s.startedAt,
    completedAt,
    mode: s.config.mode,
    questionIds: s.questionIds,
    moduleIds: s.config.moduleIds,
    timed: !!s.deadline,
    timeLimitSeconds: s.deadline ? s.config.secondsPerQuestion * s.questionIds.length : null,
    scored: s.scored,
    contentVersion: CONTENT_VERSION
  };
}

export function Rationale({ q, selected }: { q: QuestionItem; selected: string | null }) {
  const mod = moduleById[q.moduleId];
  return (
    <div className="card space-y-3 p-4 text-[15px]">
      <div>
        <h2 className="text-[15px] font-semibold">Why</h2>
        <p className="mt-1">{q.rationale}</p>
      </div>
      <div>
        <h3 className="text-[14px] font-semibold">Other options</h3>
        <ul className="mt-1 space-y-1.5">
          {q.choices.filter((c) => c.id !== q.correctChoiceId).map((c) => (
            <li key={c.id} className={`text-[14px] ${c.id === selected ? 'font-medium' : ''}`}>
              <span className="font-semibold">{'ABCDE'[q.choices.indexOf(c)]}.</span> {q.wrongAnswerRationales[c.id] ?? '—'}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[14px]"><span className="font-semibold">Objective: </span>{q.learningObjective}</p>
      <div className="flex flex-wrap gap-1.5">
        {q.references.map((r, i) => (
          <span key={i} className="badge bg-sage text-ink" title={r.section}>{sourceById[r.sourceId]?.code ?? r.sourceId}{r.section ? ` · ${r.section}` : ''}</span>
        ))}
      </div>
      {mod && (
        <Link to={`/academy/review/${mod.slug}`} className="inline-flex items-center gap-1.5 text-[14px] font-semibold">
          <BookOpen size={16} aria-hidden /> Review module {mod.number}
        </Link>
      )}
      {q.status !== 'verified' && <p className="meta">Draft item · not yet clinically verified.</p>}
    </div>
  );
}

/* ═════════════ A07 — Results ═════════════ */
export function PracticeResultsPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<{ loading: boolean; error: string | null; attempts: Attempt[]; session: SessionRecord | null }>({ loading: true, error: null, attempts: [], session: null });
  usePageTitle('Results');

  useEffect(() => {
    Promise.all([getAttemptsForSession(sessionId), getAllSessions()])
      .then(([attempts, sessions]) => setState({ loading: false, error: null, attempts, session: sessions.find((s) => s.sessionId === sessionId) ?? null }))
      .catch((e: Error) => setState({ loading: false, error: e.message, attempts: [], session: null }));
  }, [sessionId]);

  const { attempts, session } = state;
  const ordered = useMemo(() => {
    const order = session?.questionIds ?? attempts.map((a) => a.questionId);
    return order.map((id) => attempts.find((a) => a.questionId === id)).filter((a): a is Attempt => !!a);
  }, [attempts, session]);
  const correctN = ordered.filter((a) => a.correct).length;
  const totalTime = ordered.reduce((s, a) => s + a.durationSeconds, 0);
  const byModule = useMemo(() => {
    const m = new Map<string, { n: number; c: number }>();
    for (const a of ordered) for (const t of a.moduleTags) {
      const v = m.get(t) ?? { n: 0, c: 0 };
      v.n++;
      if (a.correct) v.c++;
      m.set(t, v);
    }
    return [...m.entries()].map(([id, v]) => ({ id, ...v, pct: Math.round((v.c / v.n) * 100) })).sort((a, b) => a.pct - b.pct);
  }, [ordered]);
  const missed = ordered.filter((a) => !a.correct);
  const [sortBy, setSortBy] = useState<'order' | 'module'>('order');
  const missedSorted = sortBy === 'module' ? [...missed].sort((a, b) => a.moduleTags[0].localeCompare(b.moduleTags[0], undefined, { numeric: true })) : missed;

  const retryMissed = async () => {
    if (!missed.length) return;
    const ids = missed.map((a) => a.questionId);
    const s: ActiveSession = {
      sessionId: `s_retry_${Date.now()}`,
      config: { ...DEFAULT_CONFIG, mode: session?.mode === 'demo' ? 'demo' : 'practice', count: ids.length },
      questionIds: ids,
      index: 0,
      answers: Object.fromEntries(ids.map((id) => [id, { selected: null, submitted: false, flagged: false, seconds: 0 }])),
      startedAt: new Date().toISOString(),
      deadline: null,
      scored: session?.mode !== 'demo'
    };
    saveActive(s);
    try {
      await saveSession({ ...toRecord(s, ''), completedAt: null });
    } catch {
      /* non-blocking */
    }
    navigate('/academy/practice/session');
  };

  if (state.loading) return <div className="page-pad container-academy py-6"><div className="h-32 animate-pulse rounded-xl bg-sage" aria-label="Loading results" /></div>;
  if (state.error || !ordered.length)
    return (
      <div className="page-pad mx-auto max-w-[720px] py-10">
        <EmptyState title={state.error ? 'Could not load results' : 'No answers recorded for this session'} action={<Link to="/academy/practice/setup" className="btn btn-primary">New session</Link>}>
          {state.error && <p>{state.error}</p>}
        </EmptyState>
      </div>
    );

  const pct = Math.round((correctN / ordered.length) * 100);

  return (
    <div className="page-pad container-academy py-5 sm:py-6">
      <PageTitle eyebrow={`Results · ${modeLabel(session?.mode ?? 'practice')}`} title="Session results"
        actions={
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => downloadFile(`menopause-compass-session-${sessionId}.json`, JSON.stringify({ session, attempts: ordered }, null, 2))}>
              <Download size={16} aria-hidden /> Export
            </button>
            <Link to="/academy/practice/setup" className="btn btn-secondary btn-sm"><ListChecks size={16} aria-hidden /> New session</Link>
          </>
        }
      />
      {session?.mode === 'demo' && (
        <div className="mt-3"><Callout tone="info" title="Unscored demo">These results use draft items and are excluded from readiness tracking.</Callout></div>
      )}

      {/* Score row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Correct" value={`${correctN}/${ordered.length}`} sub={`${pct}%`} />
        <Stat label="Time" value={formatDuration(totalTime)} sub={`${Math.round(totalTime / ordered.length)} s / item`} />
        <Stat label="Flagged" value={String(ordered.filter((a) => a.flagged).length)} sub="for review" />
      </div>
      <p className="meta mt-2">Based on {plural(ordered.length, 'question')}. Small samples are noisy — this is not a prediction of your MSCP result.</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="card p-4" aria-labelledby="by-mod">
          <h2 id="by-mod" className="text-[16px] font-semibold">By module</h2>
          <ul className="mt-3 space-y-3">
            {byModule.map((m) => (
              <li key={m.id}>
                <div className="flex justify-between gap-2 text-[14px]">
                  <Link to={`/academy/review/${moduleById[m.id]?.slug}`} className="min-w-0 truncate font-medium text-ink">{moduleById[m.id]?.number}. {moduleById[m.id]?.title}</Link>
                  <span className="tabular shrink-0">{m.c}/{m.n}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage" aria-hidden>
                  <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.pct >= 70 ? 'var(--ok)' : 'var(--terra-ui)' }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0" aria-labelledby="missed-h">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="missed-h" className="text-[16px] font-semibold">Missed questions ({missed.length})</h2>
            {missed.length > 1 && (
              <label className="flex items-center gap-2 text-[14px]">
                Sort
                <select className="input !min-h-[36px] !w-auto !py-1" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'order' | 'module')}>
                  <option value="order">Question order</option>
                  <option value="module">Module</option>
                </select>
              </label>
            )}
          </div>
          {missed.length === 0 ? (
            <p className="mt-3 card p-4 text-[15px]"><CheckCircle2 size={18} className="mr-1 inline text-ok" aria-hidden /> No misses. Try a harder set or a new module.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {missedSorted.map((a) => {
                const q = questionById[a.questionId];
                if (!q) return null;
                return (
                  <li key={a.id} className="card px-4">
                    <details>
                      <summary className="flex min-h-[52px] cursor-pointer list-none items-start gap-2 py-3 text-[15px]">
                        <XCircle size={18} className="mt-0.5 shrink-0 text-err" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2">{q.stem}</span>
                          <span className="mt-1 flex flex-wrap gap-1.5">
                            <span className="badge bg-sage text-ink">M{moduleById[q.moduleId]?.number}</span>
                            {q.examTrapTags.map((t) => <span key={t} className="badge bg-terra-soft text-terra">{t}</span>)}
                          </span>
                        </span>
                      </summary>
                      <div className="pb-4">
                        <p className="text-[14px]">
                          Your answer: <strong>{a.selectedId ? q.choices.find((c) => c.id === a.selectedId)?.text : 'No answer'}</strong>
                        </p>
                        <p className="mt-1 text-[14px] text-ok">Correct: <strong>{q.choices.find((c) => c.id === q.correctChoiceId)?.text}</strong></p>
                        <div className="mt-3"><Rationale q={q} selected={a.selectedId} /></div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {missed.length > 0 && (
              <button type="button" className="btn btn-primary" onClick={retryMissed}><RotateCcw size={18} aria-hidden /> Review missed</button>
            )}
            {byModule[0] && byModule[0].pct < 100 && (
              <Link className="btn btn-secondary" to={`/academy/review/${moduleById[byModule[0].id]?.slug}`}><BookOpen size={18} aria-hidden /> Study module {moduleById[byModule[0].id]?.number}</Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-3 sm:p-4">
      <p className="meta">{label}</p>
      <p className="tabular mt-0.5 text-[22px] font-bold sm:text-[26px]">{value}</p>
      {sub && <p className="tabular text-[13px] text-slate">{sub}</p>}
    </div>
  );
}

