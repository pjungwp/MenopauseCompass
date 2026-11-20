import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share2, X } from 'lucide-react';
import { copyText, useToast } from '@/components/ui/Toast';

/* Capture the install prompt as early as possible (module load), so it isn't missed before the header mounts. */
type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
let deferred: BIPEvent | null = null;
const subs = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    subs.forEach((f) => f());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    subs.forEach((f) => f());
  });
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
const isIOS = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

const btn =
  'flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-[14px] font-semibold text-ink hover:bg-sage';

/** Download (install app) + Share buttons for the top header. */
export function HeaderActions() {
  const toast = useToast();
  const [, tick] = useState(0);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const f = () => {
      tick((n) => n + 1);
      setInstalled(isStandalone());
    };
    subs.add(f);
    return () => void subs.delete(f);
  }, []);

  async function install() {
    if (deferred) {
      const e = deferred;
      await e.prompt();
      const { outcome } = await e.userChoice;
      deferred = null;
      tick((n) => n + 1);
      if (outcome === 'accepted') toast('Installing Menopause Compass');
    } else {
      setHelp(true);
    }
  }

  async function share() {
    const url = window.location.href;
    const title = document.title || 'Menopause Compass';
    if (navigator.share) {
      try {
        await navigator.share({ title, text: 'Menopause Compass: clear, trustworthy menopause answers.', url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    toast((await copyText(url)) ? 'Link copied' : 'Could not copy the link', 'ok');
  }

  return (
    <>
      {!installed && (
        <button type="button" className={btn} onClick={install} aria-label="Download the app">
          <Download size={19} aria-hidden />
          <span className="hidden md:inline">Download</span>
        </button>
      )}
      <button type="button" className={btn} onClick={share} aria-label="Share this page">
        <Share2 size={19} aria-hidden />
        <span className="hidden md:inline">Share</span>
      </button>

      {help && createPortal(
        <div role="dialog" aria-modal="true" aria-labelledby="install-title" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setHelp(false)}>
          <div className="w-full max-w-[400px] rounded-2xl bg-surface p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 id="install-title" className="text-[19px] font-bold text-ink">Add to your home screen</h2>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-sage" aria-label="Close" onClick={() => setHelp(false)}>
                <X size={20} aria-hidden />
              </button>
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] text-ink">
              {isIOS() ? (
                <>
                  <li>Tap <strong>Share</strong> <Share2 size={15} className="inline" aria-hidden /> in Safari.</li>
                  <li>Choose <strong>Add to Home Screen</strong>.</li>
                </>
              ) : (
                <>
                  <li>Open the browser menu (⋮ or ⋯).</li>
                  <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                </>
              )}
            </ol>
            <p className="mt-3 text-[14px] text-slate">Works offline once added. No account needed.</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
