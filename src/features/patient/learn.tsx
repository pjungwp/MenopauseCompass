import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy, ClipboardList, Lightbulb, Siren, Share2 } from 'lucide-react';
import { faqs, topics, topicBySlug, faqBySlug, faqById, topicById, factById } from '@/content';
import type { FAQ } from '@/content';
import { SearchBox } from '@/components/search/SearchBox';
import { searchPatient, synonymHint } from '@/lib/search';
import { TopicIcon } from '@/components/ui/Icon';
import { Accordion, Callout, EmptyState } from '@/components/ui/primitives';
import { EvidenceBadge, SourceBlock } from '@/components/source/SourceLabel';
import { copyText, useToast } from '@/components/ui/Toast';
import { usePageTitle } from '@/lib/usePageTitle';
import { FEEDBACK_EMAIL } from '@/config';
import { patientSuggest, commonTopicSuggestions } from './home';

/* ───────────── /learn — topics dashboard ───────────── */
export function LearnDashboard() {
  usePageTitle('Topics');
  return (
    <div className="page-pad container-patient pt-6 sm:pt-8">
      <p className="eyebrow">Patient guide</p>
      <h1 className="mt-1 text-[24px] font-bold sm:text-[30px]">Menopause topics</h1>
      <div className="mt-4 max-w-[720px]">
        <SearchBox
          size="md"
          label="Search questions"
          placeholder="Search questions and topics"
          suggest={patientSuggest}
          submitPath={(q) => `/learn/search?q=${encodeURIComponent(q)}`}
          emptySuggestions={commonTopicSuggestions}
        />
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <li key={t.id}>
            <Link to={`/learn/topic/${t.slug}`} className="card-link flex h-full gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sage text-teal">
                <TopicIcon name={t.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-semibold">{t.title}</span>
                <span className="mt-0.5 block text-[14px] text-slate">{t.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/learn/visit-prep" className="card-link mt-6 flex items-center gap-3 p-4">
        <ClipboardList size={22} className="shrink-0 text-teal" aria-hidden />
        <span className="flex-1">
          <span className="block font-semibold">Prepare for your visit</span>
          <span className="block text-[14px] text-slate">Choose your concerns and print a one-page list of questions.</span>
        </span>
        <ArrowRight size={18} className="text-teal" aria-hidden />
      </Link>
    </div>
  );
}

/* ───────────── /learn/search ───────────── */
export function PatientSearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const topicFilter = params.get('topic') ?? '';
  usePageTitle(q ? `Results for “${q}”` : 'All questions');

  const results = useMemo(() => (q ? searchPatient(q, 30) : []), [q]);
  const filtered = topicFilter ? results.filter((r) => r.doc.topicIds.includes(topicFilter)) : results;
  const hint = q ? synonymHint(q) : null;
  const resultTopicIds = [...new Set(results.flatMap((r) => r.doc.topicIds))];

  const setTopic = (id: string) => {
    const next = new URLSearchParams(params);
    if (id && id !== topicFilter) next.set('topic', id);
    else next.delete('topic');
    setParams(next, { replace: true });
  };

  return (
    <div className="page-pad container-patient pt-5 sm:pt-8">
      <div className="sticky top-[calc(var(--header-h)+8px)] z-20 -mx-1 rounded-2xl bg-[rgba(245,241,234,0.96)] px-1 py-1">
        <SearchBox
          size="md"
          label="Search questions"
          placeholder="Search questions and topics"
          initialQuery={q}
          suggest={patientSuggest}
          submitPath={(nq) => `/learn/search?q=${encodeURIComponent(nq)}`}
          emptySuggestions={commonTopicSuggestions}
        />
      </div>

      {!q ? (
        <AllQuestions />
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-[20px] font-semibold sm:text-[24px]">
              Results for “{q}”
            </h1>
            <p className="meta" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          {hint && <p className="meta mt-1">{hint}</p>}
          {resultTopicIds.length > 1 && (
            <div className="scroll-x-chips mt-3" role="group" aria-label="Filter by topic">
              <button type="button" className="chip" aria-pressed={!topicFilter} onClick={() => setTopic('')}>All</button>
              {resultTopicIds.map((id) => (
                <button key={id} type="button" className="chip" aria-pressed={topicFilter === id} onClick={() => setTopic(id)}>
                  {topicById[id]?.title ?? id}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No reviewed answer matches that yet"
                action={
                  <a className="btn btn-secondary" href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Question request: ' + q)}`}>
                    Suggest this question
                  </a>
                }
              >
                <p>We only show answers written from reviewed sources, so we won't guess. Try different words, or browse a topic:</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {topics.slice(0, 6).map((t) => (
                    <Link key={t.id} to={`/learn/topic/${t.slug}`} className="chip">{t.title}</Link>
                  ))}
                </div>
              </EmptyState>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {filtered.map(({ doc }) => (
                <li key={doc.kind + doc.id}>
                  <Link to={doc.href} className="card-link block p-4">
                    <span className="eyebrow">{doc.kind === 'topic' ? 'Topic' : 'Question'}</span>
                    <span className="mt-0.5 block text-[17px] font-semibold">{doc.title}</span>
                    <span className="mt-1 line-clamp-3 block text-[15px] text-slate">{doc.preview}</span>
                    <span className="mt-2.5 block">
                      <EvidenceBadge factIds={doc.kind === 'faq' ? doc.item.sourceFactIds : doc.item.factIds} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function AllQuestions() {
  return (
    <div className="mt-5">
      <h1 className="text-[22px] font-bold sm:text-[28px]">Common questions</h1>
      <p className="mt-1 text-slate">Short answers first. Tap a question for details, next steps and sources.</p>
      <div className="mt-5 space-y-6">
        {topics.map((t) => {
          const list = faqs.filter((f) => f.topicIds[0] === t.id);
          if (!list.length) return null;
          return (
            <section key={t.id} aria-labelledby={`aq-${t.id}`}>
              <h2 id={`aq-${t.id}`} className="flex items-center gap-2 text-[17px] font-semibold">
                <TopicIcon name={t.icon} size={18} className="text-teal" /> {t.title}
              </h2>
              <ul className="mt-2 divide-y divide-[var(--line)] card">
                {list.map((f) => (
                  <li key={f.id}>
                    <Link to={`/learn/faq/${f.slug}`} className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium text-ink no-underline hover:bg-sage hover:no-underline">
                      {f.question}
                      <ArrowRight size={16} className="shrink-0 text-teal" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── /learn/topic/:slug ───────────── */
export function TopicPage() {
  const { slug = '' } = useParams();
  const t = topicBySlug[slug];
  usePageTitle(t?.title ?? 'Topic not found');
  if (!t) return <NotFoundPatient />;
  const topicFaqs = faqs.filter((f) => f.topicIds.includes(t.id));
  const sections = [
    { id: 'what', label: 'What it is', show: t.whatItIs.length > 0 },
    { id: 'symptoms', label: 'Common symptoms', show: t.symptoms.length > 0 },
    { id: 'options', label: 'Care options', show: t.options.length > 0 },
    { id: 'myths', label: 'Myths & facts', show: t.myths.length > 0 },
    { id: 'when', label: 'When to see a clinician', show: t.seeClinician.length > 0 },
    { id: 'faqs', label: 'Questions', show: topicFaqs.length > 0 }
  ].filter((s) => s.show);

  return (
    <div className="page-pad container-patient pt-4 sm:pt-6">
      <BackLink to="/learn" label="All topics" />
      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
        <article className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage text-teal">
              <TopicIcon name={t.icon} size={22} />
            </span>
            <h1 className="text-[24px] font-bold sm:text-[30px]">{t.title}</h1>
          </div>
          <div className="mt-4 rounded-xl border-l-4 border-teal bg-surface p-4 text-[16px] leading-relaxed shadow-[0_0_0_1px_var(--line)] sm:text-[17px]">
            <p className="eyebrow mb-1">Short answer</p>
            {t.shortAnswer}
          </div>

          {t.whatItIs.length > 0 && (
            <section id="what" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">What it is</h2>
              <div className="prose-c reading mt-2 text-[16px]">{t.whatItIs.map((p, i) => <p key={i}>{p}</p>)}</div>
            </section>
          )}
          {t.symptoms.length > 0 && (
            <section id="symptoms" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">Common symptoms</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {t.symptoms.map((s) => (
                  <li key={s} className="rounded-lg bg-sage px-3 py-2 text-[15px]">{s}</li>
                ))}
              </ul>
            </section>
          )}
          {t.options.length > 0 && (
            <section id="options" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">Care options</h2>
              <p className="meta mt-1">General information to discuss with your clinician — not a personal recommendation.</p>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {t.options.map((o) => (
                  <li key={o.name} className="card p-4">
                    <p className="text-[16px] font-semibold">{o.name}</p>
                    <p className="mt-1 text-[15px]">{o.what}</p>
                    <dl className="mt-2 space-y-1.5 text-[14px]">
                      <div><dt className="inline font-semibold text-ok">Helps with: </dt><dd className="inline">{o.goodFor}</dd></div>
                      <div><dt className="inline font-semibold text-terra">Keep in mind: </dt><dd className="inline">{o.consider}</dd></div>
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {t.myths.length > 0 && (
            <section id="myths" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">Myths & facts</h2>
              <div className="mt-2 card px-4">
                {t.myths.map((m, i) => (
                  <Accordion key={i} summary={<span><span className="text-terra">Myth: </span>{m.myth}</span>}>
                    <p className="flex gap-2"><Lightbulb size={18} className="mt-0.5 shrink-0 text-teal" aria-hidden /> <span><strong>Fact: </strong>{m.fact}</span></p>
                  </Accordion>
                ))}
              </div>
            </section>
          )}
          {t.seeClinician.length > 0 && (
            <section id="when" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">When to see a clinician</h2>
              <div className="mt-2">
                <Callout tone="urgent" title="Contact a clinician if you have">
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {t.seeClinician.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </Callout>
              </div>
            </section>
          )}
          {topicFaqs.length > 0 && (
            <section id="faqs" className="mt-7 scroll-mt-24">
              <h2 className="text-[19px] font-semibold">Questions about {t.title.toLowerCase()}</h2>
              <ul className="mt-2 card divide-y divide-[var(--line)]">
                {topicFaqs.map((f) => (
                  <li key={f.id}>
                    <Link to={`/learn/faq/${f.slug}`} className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium text-ink no-underline hover:bg-sage hover:no-underline">
                      {f.question}
                      <ArrowRight size={16} className="shrink-0 text-teal" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="mt-8">
            <SourceBlock factIds={t.factIds} />
          </div>
        </article>

        <aside className="hidden lg:block" aria-label="On this page">
          <div className="sticky top-[calc(var(--header-h)+24px)] space-y-4">
            <nav className="card p-4">
              <p className="eyebrow mb-2">On this page</p>
              <ul className="space-y-1.5 text-[14px]">
                {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}
              </ul>
            </nav>
            <Link to="/learn/visit-prep" className="btn btn-secondary w-full">
              <ClipboardList size={18} aria-hidden /> Prepare for a visit
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────────── /learn/faq/:slug ───────────── */
export function FaqPage() {
  const { slug = '' } = useParams();
  const f = faqBySlug[slug];
  const toast = useToast();
  usePageTitle(f?.question ?? 'Question not found');
  if (!f) return <NotFoundPatient />;
  const related = f.relatedFaqIds.map((id) => faqById[id]).filter(Boolean) as FAQ[];
  const topic = topicById[f.topicIds[0]];
  const redFlags = [...new Set(f.sourceFactIds.flatMap((id) => factById[id]?.redFlags ?? []))];

  const share = async () => {
    const url = window.location.href;
    const text = `${f.question}\n\n${f.conciseAnswer}\n\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: f.question, text: f.conciseAnswer, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    toast((await copyText(text)) ? 'Answer copied' : 'Could not copy', 'ok');
  };

  return (
    <div className="page-pad container-patient pt-4 sm:pt-6">
      <BackLink to={topic ? `/learn/topic/${topic.slug}` : '/learn'} label={topic?.title ?? 'Topics'} />
      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <article className="min-w-0">
          <h1 className="text-[23px] font-bold leading-tight sm:text-[30px] text-balance">{f.question}</h1>
          <div className="mt-4 rounded-xl border-l-4 border-teal bg-surface p-4 text-[16px] leading-relaxed shadow-[0_0_0_1px_var(--line)] sm:text-[17px]">
            <p className="eyebrow mb-1">Short answer</p>
            {f.conciseAnswer}
          </div>
          {f.clinicalEscalationNotice && (
            <div className="mt-4">
              <Callout tone="urgent">{f.clinicalEscalationNotice}</Callout>
            </div>
          )}
          <div className="mt-4 card px-4">
            <Accordion summary="Learn more" defaultOpen={false} level={2}>
              <div className="space-y-4">
                {f.detailsBlocks.map((b, i) => (
                  <div key={i}>
                    {b.heading && <h3 className="mb-1 text-[16px] font-semibold">{b.heading}</h3>}
                    <p className="reading text-[15.5px]">{b.body}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
          {f.nextSteps.length > 0 && (
            <section className="mt-6" aria-labelledby="next-h">
              <h2 id="next-h" className="text-[18px] font-semibold">Next steps</h2>
              <ul className="mt-2 space-y-2">
                {f.nextSteps.map((s) => (
                  <li key={s} className="flex gap-2 text-[15px]"><ArrowRight size={16} className="mt-1 shrink-0 text-teal" aria-hidden />{s}</li>
                ))}
              </ul>
            </section>
          )}
          {redFlags.length > 0 && !f.clinicalEscalationNotice && (
            <div className="mt-6">
              <Callout tone="caution" title="When to get checked">
                <ul className="list-disc space-y-1 pl-5">{redFlags.map((r) => <li key={r}>{r}</li>)}</ul>
              </Callout>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={share}>
              {'share' in navigator ? <Share2 size={18} aria-hidden /> : <Copy size={18} aria-hidden />} Share this answer
            </button>
            <Link to="/learn/visit-prep" className="btn btn-ghost"><ClipboardList size={18} aria-hidden /> Add to visit questions</Link>
          </div>
          <p className="meta mt-2">Shared text contains only this general answer — nothing about you.</p>
          <div className="mt-8">
            <SourceBlock factIds={f.sourceFactIds} />
          </div>
        </article>
        <aside className="mt-8 lg:mt-0" aria-labelledby="rel-h">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <h2 id="rel-h" className="text-[16px] font-semibold">Related questions</h2>
            <ul className="mt-2 space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link to={`/learn/faq/${r.slug}`} className="card-link block p-3 text-[15px] font-medium">{r.question}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2 rounded-xl bg-sage p-3 text-[14px]">
              <Siren size={16} className="mt-0.5 shrink-0 text-err" aria-hidden />
              <p>This is general education, not a diagnosis. For urgent symptoms call 911 or your clinician.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium">
      <ArrowLeft size={16} aria-hidden /> {label}
    </Link>
  );
}

export function NotFoundPatient() {
  return (
    <div className="page-pad container-patient py-12">
      <EmptyState
        title="We couldn't find that page"
        action={<Link to="/learn" className="btn btn-primary">Browse topics</Link>}
      >
        <p>It may have moved. Try searching instead.</p>
      </EmptyState>
    </div>
  );
}
