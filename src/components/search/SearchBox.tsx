import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BookOpen } from 'lucide-react';

export interface Suggestion {
  id: string;
  label: string;
  href: string;
  kind: string;
}

/**
 * Accessible combobox search: autocomplete, arrow-key navigation, clear control.
 * Enter with no highlighted suggestion submits to the full results page.
 */
export function SearchBox({
  suggest,
  submitPath,
  placeholder,
  label,
  initialQuery = '',
  size = 'lg',
  autoFocus = false,
  emptySuggestions = [],
  onSubmitted
}: {
  suggest: (q: string) => Suggestion[];
  submitPath: (q: string) => string;
  placeholder: string;
  label: string;
  initialQuery?: string;
  size?: 'lg' | 'md';
  autoFocus?: boolean;
  emptySuggestions?: Suggestion[];
  onSubmitted?: () => void;
}) {
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQ(initialQuery), [initialQuery]);

  const items = useMemo(() => (q.trim().length >= 2 ? suggest(q) : emptySuggestions), [q, suggest, emptySuggestions]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    onSubmitted?.();
    navigate(href);
  };

  const submit = () => {
    if (active >= 0 && items[active]) return go(items[active].href);
    if (q.trim()) go(submitPath(q.trim()));
  };

  const h = size === 'lg' ? 'h-[52px] text-[16px]' : 'h-[44px] text-[15px]';
  const showList = open && items.length > 0;

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          {label}
        </label>
        <div className={`flex items-center rounded-xl border border-line-strong bg-surface ${h} focus-within:border-teal focus-within:ring-2 focus-within:ring-teal-soft`}>
          <Search size={20} className="ml-3.5 shrink-0 text-slate" aria-hidden />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            autoFocus={autoFocus}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-ink placeholder:text-slate focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            placeholder={placeholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
                setActive((a) => Math.min(a + 1, items.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, -1));
              } else if (e.key === 'Escape') {
                setOpen(false);
                setActive(-1);
              }
            }}
          />
          {q && (
            <button
              type="button"
              className="mr-1 grid h-10 w-10 place-items-center rounded-lg text-slate hover:bg-sage"
              aria-label="Clear search"
              onClick={() => {
                setQ('');
                setActive(-1);
                inputRef.current?.focus();
              }}
            >
              <X size={18} aria-hidden />
            </button>
          )}
          <button type="submit" className="btn btn-primary mr-1.5 hidden !min-h-[40px] sm:inline-flex">
            Search
          </button>
        </div>
      </form>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label={q.trim().length >= 2 ? 'Suggestions' : 'Common topics'}
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-[60vh] overflow-auto rounded-xl border border-line bg-surface py-1.5 shadow-lg"
        >
          {q.trim().length < 2 && <li className="px-4 pb-1 pt-1.5 eyebrow" role="presentation">Common topics</li>}
          {items.map((s, i) => (
            <li
              key={s.kind + s.id}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={`flex cursor-pointer items-start gap-2.5 px-4 py-2.5 text-[15px] ${i === active ? 'bg-sage' : 'hover:bg-sage'}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(s.href)}
            >
              {s.kind === 'topic' || s.kind === 'module' ? (
                <BookOpen size={16} className="mt-1 shrink-0 text-teal" aria-hidden />
              ) : (
                <FileText size={16} className="mt-1 shrink-0 text-slate" aria-hidden />
              )}
              <span className="min-w-0">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
