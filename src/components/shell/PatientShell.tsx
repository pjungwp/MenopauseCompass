import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { AudienceToggle, Footer, Logo, OfflineNotice, PreviewBanner } from './Common';

const links = [
  { to: '/learn/search', label: 'Questions' },
  { to: '/learn', label: 'Topics', end: true },
  { to: '/learn/visit-prep', label: 'Prepare for a visit' }
];

export function PatientShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setMenuOpen(false), [loc.pathname]);
  useEffect(() => {
    document.documentElement.dataset.audience = 'patient';
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <OfflineNotice />
      <PreviewBanner />
      <header className="no-print sticky top-0 z-40 border-b border-line backdrop-blur" style={{ background: 'rgba(245,241,234,0.96)' }}>
        <div className="page-pad mx-auto flex h-[var(--header-h)] max-w-[1120px] items-center gap-3">
          <Logo />
          <nav aria-label="Patient guide" className="ml-4 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-[15px] font-medium no-underline hover:bg-sage hover:no-underline ${isActive ? 'text-teal' : 'text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <AudienceToggle current="patient" />
            </div>
            {loc.pathname !== '/' && (
              <Link to="/learn/search" className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-sage lg:hidden" aria-label="Search questions">
                <Search size={20} aria-hidden />
              </Link>
            )}
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-sage lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="patient-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div id="patient-menu" className="border-t border-line bg-surface lg:hidden">
            <nav aria-label="Patient guide menu" className="page-pad mx-auto max-w-[1120px] py-2">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className="flex min-h-[48px] items-center border-b border-line text-[16px] font-medium text-ink no-underline last:border-0">
                  {l.label}
                </NavLink>
              ))}
              <Link to="/about" className="flex min-h-[48px] items-center text-[16px] font-medium text-ink no-underline">About & sources</Link>
              <div className="py-3 sm:hidden">
                <AudienceToggle current="patient" />
              </div>
            </nav>
          </div>
        )}
      </header>
      <main id="main" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer audience="patient" />
    </div>
  );
}
