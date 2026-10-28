import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Stethoscope, Siren } from 'lucide-react';
import { faqs, topics, topicById } from '@/content';
import { SearchBox, type Suggestion } from '@/components/search/SearchBox';
import { suggestPatient, POPULAR_TOPIC_IDS } from '@/lib/search';
import { TopicIcon } from '@/components/ui/Icon';
import { usePageTitle } from '@/lib/usePageTitle';

export const patientSuggest = (q: string): Suggestion[] =>
  suggestPatient(q, 7).map((d) => ({ id: d.id, label: d.title, href: d.href, kind: d.kind }));

export const commonTopicSuggestions: Suggestion[] = POPULAR_TOPIC_IDS.map((id) => {
  const t = topicById[id];
  return { id: t.id, label: t.title, href: `/learn/topic/${t.slug}`, kind: 'topic' };
});

export function HomePage() {
  usePageTitle('Menopause questions, answered clearly');
  const featured = topics.filter((t) => t.featured).slice(0, 6);
  const popular = faqs.filter((f) => f.popular).slice(0, 3);

  return (
    <div className="page-pad container-patient pt-4 sm:pt-10">
      {/* Hero: headline + search. Search is above the fold on every viewport. */}
      <section className="grid items-center gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" aria-labelledby="home-h">
        <div className="flex min-w-0 flex-col">
          <p className="eyebrow">Patient guide</p>
          <h1 id="home-h" className="mt-1.5 text-[27px] font-bold leading-[1.15] sm:text-[34px] lg:text-[42px] text-balance">
            Clear, trustworthy answers about menopause.
          </h1>
          <p className="order-3 mt-3 max-w-[56ch] text-[15px] text-slate sm:order-none sm:text-[17px]">
            Search a question or pick a topic. Written in plain language from current medical guidance — no account needed.
          </p>
          <div className="mt-3 sm:mt-5">
            <SearchBox
              label="Ask a menopause question"
              placeholder="e.g. Are hot flashes normal at 47?"
              suggest={patientSuggest}
              submitPath={(q) => `/learn/search?q=${encodeURIComponent(q)}`}
              emptySuggestions={commonTopicSuggestions}
            />
          </div>
        </div>
        <HeroArt />
      </section>

      {/* Topic tiles */}
      <section className="mt-8 sm:mt-10" aria-labelledby="topics-h">
        <div className="flex items-end justify-between gap-3">
          <h2 id="topics-h" className="text-[20px] font-semibold sm:text-[22px]">Explore topics</h2>
          <Link to="/learn" className="text-[15px] font-semibold">All topics</Link>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {featured.map((t) => (
            <li key={t.id}>
              <Link to={`/learn/topic/${t.slug}`} className="card-link flex h-full flex-col gap-2 p-3.5 sm:p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-sage text-teal">
                  <TopicIcon name={t.icon} />
                </span>
                <span className="text-[16px] font-semibold leading-snug">{t.title}</span>
                <span className="hidden text-[14px] text-slate sm:block">{t.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Popular questions */}
        <section aria-labelledby="pop-h" className="min-w-0">
          <h2 id="pop-h" className="text-[20px] font-semibold sm:text-[22px]">Popular questions</h2>
          <ul className="mt-3 space-y-2.5">
            {popular.map((f) => (
              <li key={f.id}>
                <Link to={`/learn/faq/${f.slug}`} className="card-link block p-4">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[16px] font-semibold">{f.question}</span>
                    <ArrowRight size={18} className="mt-0.5 shrink-0 text-teal" aria-hidden />
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[14px] text-slate">{f.conciseAnswer}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/learn/search" className="mt-3 inline-block text-[15px] font-semibold">Browse all questions</Link>
        </section>

        <aside className="space-y-3 min-w-0">
          <Link to="/learn/visit-prep" className="card-link flex items-start gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sage text-teal">
              <ClipboardList size={20} aria-hidden />
            </span>
            <span>
              <span className="block text-[16px] font-semibold">Prepare for your visit</span>
              <span className="block text-[14px] text-slate">Build a printable list of symptoms and questions. Stays on your device.</span>
            </span>
          </Link>
          <Link to="/academy" className="card-link flex items-start gap-3 p-4" style={{ background: 'var(--lavender)' }}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface text-teal">
              <Stethoscope size={20} aria-hidden />
            </span>
            <span>
              <span className="block text-[16px] font-semibold">For clinicians: MSCP Academy</span>
              <span className="block text-[14px] text-slate">High-yield review, practice questions and AI study prompts.</span>
            </span>
          </Link>
          <div className="flex gap-3 rounded-xl border p-4 text-[14px]" style={{ borderColor: 'var(--terra-ui)', background: 'var(--terra-soft)' }}>
            <Siren size={18} className="mt-0.5 shrink-0 text-terra" aria-hidden />
            <p>
              <strong className="text-terra">Get care promptly</strong> for any bleeding after menopause, chest pain, sudden shortness of breath, leg swelling, or stroke symptoms. In an emergency call 911.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Restrained editorial illustration — hidden on phones so search comes first. */
function HeroArt() {
  return (
    <div className="hidden lg:block" aria-hidden="true">
      <svg viewBox="0 0 420 220" className="h-[220px] w-full">
        <rect x="0" y="0" width="420" height="220" rx="20" fill="#E5EFEB" />
        <circle cx="300" cy="110" r="74" fill="#fff" />
        <circle cx="300" cy="110" r="58" fill="none" stroke="#176C6B" strokeOpacity=".25" strokeWidth="2" />
        <path d="M300 48 L316 110 L300 172 L284 110 Z" fill="#173D40" />
        <path d="M300 48 L316 110 L284 110 Z" fill="#B9634D" />
        <circle cx="300" cy="110" r="6" fill="#fff" />
        <g fill="#176C6B" opacity=".9">
          <rect x="36" y="48" width="150" height="14" rx="7" />
          <rect x="36" y="74" width="112" height="10" rx="5" opacity=".45" />
          <rect x="36" y="94" width="128" height="10" rx="5" opacity=".45" />
          <rect x="36" y="130" width="150" height="14" rx="7" />
          <rect x="36" y="156" width="96" height="10" rx="5" opacity=".45" />
        </g>
      </svg>
    </div>
  );
}
