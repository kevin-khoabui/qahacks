'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export type SearchPost = {
  slug: string;
  title: string;
  category: string;
  tool: string;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut + custom open event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, []);

  // Modal open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setPosts([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // API Search
  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setPosts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );

        if (!res.ok) throw new Error('Search failed');

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="relative z-[100]">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" />

      <div
        className="fixed inset-0 z-[101] overflow-y-auto p-4 sm:p-6 md:p-20 pt-[10vh]"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="mx-auto max-w-2xl transform divide-y divide-slate-800 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-800/50 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              ref={inputRef}
              type="text"
              className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:ring-0 sm:text-lg outline-none"
              placeholder="Search by keyword, tool, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-700 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          {query.trim() !== '' && (
            <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
              {loading ? (
                <div className="px-6 py-14 text-center text-slate-500">
                  Searching...
                </div>
              ) : posts.length > 0 ? (
                <ul className="space-y-1">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 hover:bg-emerald-500/10 transition-colors"
                      >
                        <div className="flex flex-col truncate pr-4">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                            {post.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {post.tool !== 'None' && (
                            <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/30">
                              {post.tool}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <p className="mt-4 font-semibold text-slate-300">
                    No results found
                  </p>
                  <p className="mt-2 text-slate-500">
                    We couldn't find anything matching "{query}".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}