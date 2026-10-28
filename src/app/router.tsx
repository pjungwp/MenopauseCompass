import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { PatientShell } from '@/components/shell/PatientShell';
import { ScrollToTop, UpdatePrompt } from '@/components/shell/Common';
import { HomePage } from '@/features/patient/home';
import { LearnDashboard, PatientSearchPage, TopicPage, FaqPage, NotFoundPatient } from '@/features/patient/learn';
import { VisitPrepPage } from '@/features/patient/visitPrep';
import { SourcesPage, AboutPage, PrivacyPage } from '@/features/info';

// Academy is code-split from the patient homepage (exam engine, toolkit, progress).
const AcademyShell = lazy(() => import('@/components/shell/AcademyShell').then((m) => ({ default: m.AcademyShell })));
const AcademyDashboard = lazy(() => import('@/features/academy/dashboard').then((m) => ({ default: m.AcademyDashboard })));
const CertificationPage = lazy(() => import('@/features/academy/certification').then((m) => ({ default: m.CertificationPage })));
const ReviewIndexPage = lazy(() => import('@/features/academy/review').then((m) => ({ default: m.ReviewIndexPage })));
const ReviewArticlePage = lazy(() => import('@/features/academy/review').then((m) => ({ default: m.ReviewArticlePage })));
const PracticeSetupPage = lazy(() => import('@/features/academy/practice').then((m) => ({ default: m.PracticeSetupPage })));
const PracticeSessionPage = lazy(() => import('@/features/academy/practice').then((m) => ({ default: m.PracticeSessionPage })));
const PracticeResultsPage = lazy(() => import('@/features/academy/practice').then((m) => ({ default: m.PracticeResultsPage })));
const AIToolkitPage = lazy(() => import('@/features/academy/toolkit').then((m) => ({ default: m.AIToolkitPage })));
const ProgressPage = lazy(() => import('@/features/academy/progress').then((m) => ({ default: m.ProgressPage })));
const EditorPage = lazy(() => import('@/features/editor').then((m) => ({ default: m.EditorPage })));

function Loading() {
  return (
    <div className="page-pad py-8" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-sage" />
      <div className="mt-4 h-24 animate-pulse rounded-xl bg-sage" />
    </div>
  );
}
const S = (el: ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

function Root() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <UpdatePrompt />
    </>
  );
}

function RouteError() {
  return (
    <div className="page-pad mx-auto max-w-[640px] py-16 text-center">
      <h1 className="text-[22px] font-bold">Something went wrong</h1>
      <p className="mt-2 text-slate">Please reload the page. Your saved progress is stored on this device and is not affected.</p>
      <div className="mt-5 flex justify-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      {
        element: <PatientShell />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/learn', element: <LearnDashboard /> },
          { path: '/learn/search', element: <PatientSearchPage /> },
          { path: '/learn/topic/:slug', element: <TopicPage /> },
          { path: '/learn/faq/:slug', element: <FaqPage /> },
          { path: '/learn/visit-prep', element: <VisitPrepPage /> },
          { path: '/sources', element: <SourcesPage /> },
          { path: '/about', element: <AboutPage /> },
          { path: '/privacy', element: <PrivacyPage /> },
          { path: '*', element: <NotFoundPatient /> }
        ]
      },
      {
        path: '/academy',
        element: S(<AcademyShell />),
        children: [
          { index: true, element: S(<AcademyDashboard />) },
          { path: 'certification', element: S(<CertificationPage />) },
          { path: 'review', element: S(<ReviewIndexPage />) },
          { path: 'review/:slug', element: S(<ReviewArticlePage />) },
          { path: 'practice', element: S(<PracticeSetupPage />) },
          { path: 'practice/setup', element: S(<PracticeSetupPage />) },
          { path: 'practice/session', element: S(<PracticeSessionPage />) },
          { path: 'practice/results/:sessionId', element: S(<PracticeResultsPage />) },
          { path: 'ai-toolkit', element: S(<AIToolkitPage />) },
          { path: 'progress', element: S(<ProgressPage />) },
          { path: 'sources', element: <SourcesPage academy /> },
          ...(import.meta.env.DEV ? [{ path: 'editor', element: S(<EditorPage />) }] : [])
        ]
      }
    ]
  }
]);
