import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share2, X, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
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

  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      {!installed && (
        <button type="button" className={btn} onClick={install} aria-label="Download the app">
          <Download size={19} aria-hidden />
          <span className="hidden md:inline">Download</span>
        </button>
      )}
      <button type="button" className={btn} onClick={() => setShareOpen(true)} aria-label="Share this page">
        <Share2 size={19} aria-hidden />
        <span className="hidden md:inline">Share</span>
      </button>
      {shareOpen && <SharePanel onClose={() => setShareOpen(false)} />}

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

/** Share panel: big scannable QR first, then native share / copy link. */
function SharePanel({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const pageUrl = window.location.href;
  const homeUrl = window.location.origin + '/';
  const [target, setTarget] = useState<'page' | 'home'>(pageUrl === homeUrl ? 'home' : 'page');
  const url = target === 'home' ? homeUrl : pageUrl;
  const [svg, setSvg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#173D40', light: '#FFFFFF' } })
      .then(setSvg)
      .catch(() => setSvg(''));
    setCopied(false);
  }, [url]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  async function nativeShare() {
    try {
      await navigator.share({ title: 'Menopause Compass', text: 'Menopause Compass: clear, trustworthy menopause answers.', url });
    } catch {
      /* cancelled */
    }
  }
  async function copy() {
    if (await copyText(url)) {
      setCopied(true);
      toast('Link copied');
    } else toast('Could not copy the link', 'error');
  }

  const chip = (on: boolean) =>
    `min-h-[40px] flex-1 rounded-full px-3 text-[14px] font-semibold ${on ? 'bg-teal text-white' : 'text-ink hover:bg-sage'}`;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="share-title" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-3" onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl bg-surface p-4 shadow-xl sm:p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h2 id="share-title" className="text-[20px] font-bold text-ink">Scan to open</h2>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-sage" aria-label="Close" onClick={onClose}>
            <X size={22} aria-hidden />
          </button>
        </div>

        <div
          className="mx-auto mt-3 aspect-square w-full max-w-[min(360px,62vh)] rounded-xl border border-line bg-white p-3 [&>svg]:h-full [&>svg]:w-full"
          role="img"
          aria-label={`QR code for ${url}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        {pageUrl !== homeUrl && (
          <div className="mt-3 flex rounded-full border border-line-strong bg-surface p-0.5" role="group" aria-label="What to share">
            <button type="button" className={chip(target === 'page')} aria-pressed={target === 'page'} onClick={() => setTarget('page')}>This page</button>
            <button type="button" className={chip(target === 'home')} aria-pressed={target === 'home'} onClick={() => setTarget('home')}>Home page</button>
          </div>
        )}

        <p className="mt-2 truncate text-center text-[13px] text-slate" title={url}>{url.replace(/^https?:\/\//, '')}</p>

        <div className="mt-3 flex gap-2">
          {typeof navigator.share === 'function' && (
            <button type="button" onClick={nativeShare} className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-4 text-[16px] font-semibold text-white">
              <Share2 size={18} aria-hidden /> Share…
            </button>
          )}
          <button type="button" onClick={copy} className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong px-4 text-[16px] font-semibold text-ink hover:bg-sage">
            {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />} {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
