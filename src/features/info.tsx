import { ExternalLink, AlertTriangle, CheckCircle2, Mail } from 'lucide-react';
import { sources, facts, questions, faqs, topics, modules, CONTENT_RELEASE } from '@/content';
import { Accordion, PageTitle } from '@/components/ui/primitives';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { EDITOR_NAME, FEEDBACK_EMAIL, PREVIEW_EDITION } from '@/config';

const revisionLog = [
  { date: '2026-10-28', note: `Preview edition 1.0: ${topics.length} patient topics, ${faqs.length} FAQs, ${modules.length} review modules, ${questions.length} draft practice items. Incorporates FDA HT labeling changes (2025–26), fezolinetant hepatic boxed warning (2024), elinzanetant approval (2025), and the 2027 MSCP handbook format.` }
];

/* ═════════════ A10 — Sources ═════════════ */
export function SourcesPage({ academy = false }: { academy?: boolean }) {
  usePageTitle('Sources');
  const reviewed = facts.filter((f) => f.status === 'reviewed').length;
  const verified = questions.filter((q) => q.status === 'verified').length;
  return (
    <div className={`page-pad mx-auto max-w-[900px] py-6 ${academy ? '' : 'sm:py-8'}`}>
      <PageTitle eyebrow="Trust & transparency" title="Sources & review status" />
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat value={`${reviewed}/${facts.length}`} label="Facts clinically reviewed" />
        <Stat value={`${verified}/${questions.length}`} label="Practice items verified" />
        <Stat value={formatDate(CONTENT_RELEASE, { month: 'short', year: 'numeric' })} label="Content release" />
      </div>

      <section className="mt-6" aria-labelledby="src-list">
        <h2 id="src-list" className="text-[18px] font-semibold">Sources</h2>
        <ul className="mt-3 space-y-2.5">
          {sources.map((s) => (
            <li key={s.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-sage text-ink">{s.code}</span>
                <span className="badge bg-lavender text-ink">{s.type.replace('-', ' ')}</span>
                {s.currency === 'current' ? (
                  <span className="badge bg-ok-soft text-ok"><CheckCircle2 size={12} aria-hidden /> Current</span>
                ) : (
                  <span className="badge bg-terra-soft text-terra"><AlertTriangle size={12} aria-hidden /> {s.currency === 'partly-superseded' ? 'Partly superseded' : 'Review needed'}</span>
                )}
              </div>
              <p className="mt-2 text-[15px] font-semibold">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title} <ExternalLink size={13} className="inline" aria-label="(opens in a new tab)" />
                  </a>
                ) : (
                  s.title
                )}
              </p>
              <p className="meta mt-1">{s.citation}</p>
              {s.note && <p className="mt-1.5 text-[14px] text-terra">{s.note}</p>}
              <p className="meta mt-1.5">Last checked {formatDate(s.lastChecked)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 card px-4" aria-label="Methods">
        <Accordion summary="How content is written and reviewed" level={2} defaultOpen>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li><strong>Draft</strong> — each clinical assertion is written as a "fact" linked to a source section.</li>
            <li><strong>Content check</strong> — automated tests confirm every fact, FAQ and question links to a real source and that answer keys are valid.</li>
            <li><strong>Clinical verification</strong> — a clinician reviews each fact and practice item. Only verified items are used in scored practice.</li>
            <li><strong>Accessibility & readability QA</strong> — patient wording is reviewed separately from clinician wording.</li>
            <li><strong>Publish</strong> — with a review date. When a source changes, linked facts are flagged for re-review.</li>
          </ol>
          <p className="mt-3">We summarize and cite sources; we do not reproduce copyrighted publications. Follow the links to read originals.</p>
        </Accordion>
        <Accordion summary="Revision log" level={2}>
          <ul className="space-y-2">
            {revisionLog.map((r) => <li key={r.date}><strong>{formatDate(r.date)}:</strong> {r.note}</li>)}
          </ul>
        </Accordion>
        <Accordion summary="Report an issue" level={2}>
          <p>Spotted an error or outdated statement? Tell us which page and what source you're looking at.</p>
          <a className="btn btn-secondary mt-3" href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Menopause Compass content issue')}`}><Mail size={16} aria-hidden /> Email the editor</a>
        </Accordion>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-3">
      <p className="tabular text-[18px] font-bold sm:text-[22px]">{value}</p>
      <p className="text-[12.5px] text-slate">{label}</p>
    </div>
  );
}

export function AboutPage() {
  usePageTitle('About');
  return (
    <div className="page-pad mx-auto max-w-[900px] py-6 sm:py-8">
      <PageTitle eyebrow="About" title="About Menopause Compass" />
      <div className="prose-c mt-4 space-y-4 text-[16px] leading-relaxed">
        <p>
          Menopause Compass has two parts: a <strong>Patient Guide</strong> with plain-language answers about menopause, and the <strong>MSCP Academy</strong>, an independent study resource for clinicians preparing for The Menopause Society Certified Practitioner exam.
        </p>
        {PREVIEW_EDITION && (
          <div className="rounded-xl bg-lavender p-4 text-[15px]">
            <p><strong>This is a preview edition.</strong> Content was drafted from published position statements and FDA communications with AI assistance and is awaiting clinical review. Each page shows its review status. Practice questions are unscored until a clinician verifies them.</p>
          </div>
        )}
        <h2 className="text-[19px] font-semibold">Independence</h2>
        <p>
          MSCP Academy is not affiliated with, endorsed by, or sponsored by The Menopause Society. Practice items are original and are not official exam questions. We make no claims about exam content beyond the publicly posted content outline, and we don't estimate pass likelihood.
        </p>
        <h2 className="text-[19px] font-semibold">Not medical advice</h2>
        <p>
          The Patient Guide is general education. It does not diagnose conditions or recommend treatment for any individual. Talk with your own clinician about your health. In an emergency, call 911.
        </p>
        <h2 className="text-[19px] font-semibold">Editor</h2>
        <p>{EDITOR_NAME}. Questions or corrections: <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  usePageTitle('Privacy');
  return (
    <div className="page-pad mx-auto max-w-[900px] py-6 sm:py-8">
      <PageTitle eyebrow="Privacy" title="How your data is handled" />
      <div className="mt-4 space-y-4 text-[16px] leading-relaxed">
        <p className="rounded-xl bg-sage p-4"><strong>Short version:</strong> there are no accounts and we don't collect your health information. Anything you enter stays in your browser on your device.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Visit prep</strong> choices and notes are saved in your browser's local storage so you can come back to them. Use <em>Clear all</em> to delete them.</li>
          <li><strong>Practice progress</strong> (answers, timing, flags) is stored in your browser's IndexedDB. You can export, import, or clear it from the Progress page.</li>
          <li><strong>Search</strong> runs entirely in your browser. Search terms are not sent to a server.</li>
          <li><strong>No analytics or advertising trackers</strong> are included in this release.</li>
          <li><strong>Hosting:</strong> the site is served as static files. Like any web host, the hosting provider may keep standard server logs (such as IP address and pages requested).</li>
          <li><strong>External links</strong> (journals, the FDA, The Menopause Society, AI assistants) open other sites with their own privacy policies.</li>
          <li><strong>AI prompts</strong> are copied to your clipboard only. Never paste identifiable patient information into an external AI tool.</li>
        </ul>
        <p className="meta">Clearing your browser's site data also removes everything stored by this app.</p>
      </div>
    </div>
  );
}
