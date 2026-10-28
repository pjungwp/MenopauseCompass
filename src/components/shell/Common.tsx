import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { WifiOff, RefreshCw, FlaskConical, Stethoscope, UserRound } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { PREVIEW_EDITION } from '@/config';
import { AUDIENCE_KEY, safeLocal } from '@/lib/storage';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 no-underline hover:no-underline" aria-label="Menopause Compass home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#173D40" />
        <circle cx="16" cy="16" r="11.5" fill="none" stroke="#E5EFEB" strokeWidth="1.2" opacity=".7" />
        <path d="M16 6.5 L19 16 L16 25.5 L13 16 Z" fill="#E5EFEB" />
        <path d="M16 6.5 L19 16 L13 16 Z" fill="#B9634D" />
        <circle cx="16" cy="16" r="1.8" fill="#173D40" />
      </svg>
      {!compact && (
        <span className="text-[17px] font-bold tracking-tight text-ink">
          Menopause <span className="text-teal">Compass</span>
        </span>
      )}
    </Link>
  );
}

/** Patient / professional pill switch. Persists preference locally. */
export function AudienceToggle({ current }: { current: 'patient' | 'academy' }) {
  return (
    <nav aria-label="Audience" className="flex shrink-0 rounded-full border border-line-strong bg-surface p-0.5 text-[13px] font-semibold">
      <Link
        to="/learn"
        onClick={() => safeLocal.set(AUDIENCE_KEY, 'patient')}
        aria-current={current === 'patient' ? 'page' : undefined}
        className={`flex min-h-[36px] items-center gap-1.5 rounded-full px-3 no-underline hover:no-underline ${current === 'patient' ? 'bg-teal text-white' : 'text-ink hover:bg-sage'}`}
      >
        <UserRound size={15} aria-hidden />
        <span>Patients</span>
      </Link>
      <Link
        to="/academy"
        onClick={() => safeLocal.set(AUDIENCE_KEY, 'academy')}
        aria-current={current === 'academy' ? 'page' : undefined}
        className={`flex min-h-[36px] items-center gap-1.5 rounded-full px-3 no-underline hover:no-underline ${current === 'academy' ? 'bg-teal text-white' : 'text-ink hover:bg-sage'}`}
      >
        <Stethoscope size={15} aria-hidden />
        <span>Clinicians</span>
      </Link>
    </nav>
  );
}

export function PreviewBanner() {
  const [hidden, setHidden] = useState(() => safeLocal.get('mc.previewDismissed', false));
  if (!PREVIEW_EDITION || hidden) return null;
  return (
    <div className="no-print border-b border-line bg-lavender text-[13px]">
      <div className="page-pad mx-auto flex max-w-[1480px] items-center gap-2 py-1.5">
        <FlaskConical size={14} className="shrink-0 text-teal" aria-hidden />
        <p className="min-w-0 flex-1">
          <strong>Preview<span className="hidden sm:inline"> edition</span>.</strong>{' '}
          <span className="hidden sm:inline">Sample content drafted from published sources and awaiting clinical review. </span>
          <span className="sm:hidden">Awaiting clinical review. </span>
          <Link to="/about">
            <span className="hidden sm:inline">Learn more</span>
            <span className="sm:hidden">About</span>
          </Link>
        </p>
        <button
          type="button"
          className="min-h-[32px] shrink-0 rounded-md px-2 font-semibold text-teal hover:bg-surface"
          onClick={() => {
            safeLocal.set('mc.previewDismissed', true);
            setHidden(true);
          }}
          aria-label="Dismiss preview notice"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function OfflineNotice() {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" className="no-print bg-ink text-white text-[13px]">
      <div className="page-pad mx-auto flex max-w-[1480px] items-center gap-2 py-1.5">
        <WifiOff size={14} aria-hidden /> You're offline. Saved pages and your local progress still work; external links need a connection.
      </div>
    </div>
  );
}

/** PWA update prompt: shows when a new content/app version is cached. */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker
  } = useRegisterSW();
  if (!needRefresh && !offlineReady) return null;
  return (
    <div
      role="status"
      className="no-print fixed left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-xl border border-line bg-surface p-3 shadow-lg"
      style={{ bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom) + 12px)' }}
    >
      <div className="flex items-center gap-3 text-[14px]">
        <RefreshCw size={18} className="shrink-0 text-teal" aria-hidden />
        <p className="flex-1">{needRefresh ? 'Updated content is available.' : 'Ready to work offline.'}</p>
        {needRefresh && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => updateServiceWorker(true)}>
            Update
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setNeedRefresh(false);
            setOfflineReady(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function Footer({ audience }: { audience: 'patient' | 'academy' }) {
  return (
    <footer className="no-print mt-12 border-t border-line">
      <div className={`page-pad mx-auto ${audience === 'patient' ? 'max-w-[1120px]' : 'max-w-[1440px]'} py-6 text-[13px] text-slate`}>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <NavLink to="/sources">Sources</NavLink>
          <NavLink to="/about">About & independence</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to={audience === 'patient' ? '/academy' : '/learn'}>{audience === 'patient' ? 'For clinicians' : 'Patient guide'}</NavLink>
        </div>
        <p className="mt-3 max-w-[90ch]">
          Educational information only — not a diagnosis or a substitute for care from your own clinician. In an emergency call 911.
          MSCP Academy is an independent study resource and is not affiliated with or endorsed by The Menopause Society.
        </p>
      </div>
    </footer>
  );
}
