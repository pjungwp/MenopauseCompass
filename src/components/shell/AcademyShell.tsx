import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BadgeCheck, BookOpenCheck, ListChecks, Bot, LineChart, Library, PanelLeftClose, PanelLeftOpen, MoreHorizontal, X, Search
} from 'lucide-react';
import { AudienceToggle, Footer, Logo, OfflineNotice, PreviewBanner } from './Common';
import { SearchBox } from '@/components/search/SearchBox';
import { searchAcademy } from '@/lib/search';
import { safeLocal, SIDEBAR_KEY } from '@/lib/storage';

const nav = [
  { to: '/academy', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/academy/certification', label: 'Certification', icon: BadgeCheck },
  { to: '/academy/review', label: 'Quick Review', icon: BookOpenCheck },
  { to: '/academy/practice/setup', label: 'Practice', icon: ListChecks, match: '/academy/practice' },
  { to: '/academy/ai-toolkit', label: 'AI Toolkit', icon: Bot },
  { to: '/academy/progress', label: 'Progress', icon: LineChart },
  { to: '/academy/sources', label: 'Sources', icon: Library }
];

const bottom = [
  { to: '/academy', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/academy/review', label: 'Review', icon: BookOpenCheck },
  { to: '/academy/practice/setup', label: 'Practice', icon: ListChecks, match: '/academy/practice' },
  { to: '/academy/ai-toolkit', label: 'AI', icon: Bot }
];

const suggestAcademy = (q: string) =>
  searchAcademy(q, 7).map((r) => ({ id: r.doc.id, label: r.doc.title, href: r.doc.href, kind: r.doc.kind }));

export function AcademyShell() {
  const loc = useLocation();
  const inSession = loc.pathname.startsWith('/academy/practice/session');
  const [collapsed, setCollapsed] = useState<boolean>(() => safeLocal.get(SIDEBAR_KEY, false));
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.audience = 'academy';
    return () => {
      document.documentElement.dataset.audience = 'patient';
    };
  }, []);
  useEffect(() => {
    setMoreOpen(false);
    setSearchOpen(false);
  }, [loc.pathname]);

  const toggle = () => {
    setCollapsed((c) => {
      safeLocal.set(SIDEBAR_KEY, !c);
      return !c;
    });
  };

  const isActive = (item: { to: string; end?: boolean; match?: string }) =>
    item.end ? loc.pathname === item.to : loc.pathname.startsWith(item.match ?? item.to);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <OfflineNotice />
      {!inSession && <PreviewBanner />}
      <header className="no-print sticky top-0 z-40 border-b border-line bg-surface">
        <div className="page-pad flex h-[var(--header-h)] items-center gap-3">
          <Logo compact />
          <Link to="/academy" className="hidden text-[16px] font-bold text-ink no-underline hover:no-underline sm:block">
            MSCP <span className="text-teal">Academy</span>
          </Link>
          <span className="text-[16px] font-bold text-ink sm:hidden">Academy</span>
          {!inSession && (
            <div className="ml-4 hidden max-w-[460px] flex-1 md:block">
              <SearchBox size="md" label="Search the academy" placeholder="Search topics, drugs, thresholds…" suggest={suggestAcademy} submitPath={(q) => `/academy/review?q=${encodeURIComponent(q)}`} />
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {!inSession && (
              <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-sage md:hidden" aria-label="Search the academy" aria-expanded={searchOpen} onClick={() => setSearchOpen((s) => !s)}>
                <Search size={20} aria-hidden />
              </button>
            )}
            <div className="hidden sm:block">
              <AudienceToggle current="academy" />
            </div>
          </div>
        </div>
        {searchOpen && (
          <div className="page-pad border-t border-line py-2 md:hidden">
            <SearchBox autoFocus size="md" label="Search the academy" placeholder="Search topics, drugs, thresholds…" suggest={suggestAcademy} submitPath={(q) => `/academy/review?q=${encodeURIComponent(q)}`} />
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Sidebar: full at ≥1024 (collapsible), icon rail 768–1023, hidden on phones and during question sessions */}
        {!inSession && (
          <aside
            className={`no-print sticky top-[var(--header-h)] hidden h-[calc(100vh-var(--header-h))] shrink-0 border-r border-line bg-surface md:block ${
              collapsed ? 'w-[68px]' : 'w-[68px] lg:w-[204px] xl:w-[220px] min-[1600px]:w-[240px]'
            }`}
            aria-label="Academy navigation"
          >
            <nav className="flex h-full flex-col gap-1 p-2">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    title={item.label}
                    className={`relative flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-[15px] font-medium no-underline hover:bg-sage hover:no-underline ${
                      active ? 'bg-teal-soft text-teal' : 'text-ink'
                    }`}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-teal" aria-hidden />}
                    <Icon size={20} aria-hidden className="shrink-0" />
                    <span className={collapsed ? 'sr-only' : 'sr-only lg:not-sr-only'}>{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={toggle}
                className="mt-auto hidden min-h-[44px] items-center gap-3 rounded-lg px-3 text-[14px] text-slate hover:bg-sage lg:flex"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-pressed={collapsed}
              >
                {collapsed ? <PanelLeftOpen size={20} aria-hidden /> : <PanelLeftClose size={20} aria-hidden />}
                {!collapsed && <span>Collapse</span>}
              </button>
            </nav>
          </aside>
        )}

        <main id="main" tabIndex={-1} className={`min-w-0 flex-1 ${inSession ? '' : 'pb-safe-nav md:pb-0'}`}>
          <Outlet />
          {!inSession && <Footer audience="academy" />}
        </main>
      </div>

      {/* Phone bottom navigation */}
      {!inSession && (
        <nav
          aria-label="Academy"
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden"
          style={{ paddingBottom: 'var(--safe-bottom)' }}
        >
          <ul className="grid h-[var(--bottom-nav-h)] grid-cols-5">
            {bottom.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-full flex-col items-center justify-center gap-0.5 text-[12px] font-medium no-underline hover:no-underline ${active ? 'text-teal' : 'text-slate'}`}
                  >
                    <Icon size={22} aria-hidden />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                className={`flex h-full w-full flex-col items-center justify-center gap-0.5 text-[12px] font-medium ${moreOpen ? 'text-teal' : 'text-slate'}`}
                aria-expanded={moreOpen}
                aria-controls="academy-more"
                onClick={() => setMoreOpen((o) => !o)}
              >
                {moreOpen ? <X size={22} aria-hidden /> : <MoreHorizontal size={22} aria-hidden />}
                More
              </button>
            </li>
          </ul>
          {moreOpen && (
            <div id="academy-more" className="absolute inset-x-0 bottom-full border-t border-line bg-surface shadow-lg">
              <ul className="page-pad py-2">
                {[nav[1], nav[5], nav[6]].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="flex min-h-[48px] items-center gap-3 text-[16px] font-medium text-ink no-underline">
                      <item.icon size={20} aria-hidden className="text-teal" /> {item.label}
                    </Link>
                  </li>
                ))}
                <li className="py-3">
                  <AudienceToggle current="academy" />
                </li>
              </ul>
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
