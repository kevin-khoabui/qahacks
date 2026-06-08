'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu rút gọn để truyền từ Server xuống Client
export type SearchPost = {
  slug: string;
  title: string;
  category: string;
  tool: string;
};

export default function CommandPalette({ posts }: { posts: SearchPost[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Lắng nghe sự kiện phím tắt và sự kiện mở từ nút bấm
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

    // Lắng nghe sự kiện custom (khi người dùng click vào ô search giả ở ngoài)
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, []);

  // Tự động focus vào ô input và khóa cuộn chuột khi mở Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Đợi modal render xong mới focus để tránh lỗi
      setTimeout(() => inputRef.current?.focus(), 100); 
    } else {
      document.body.style.overflow = 'unset';
      setQuery(''); // Xóa từ khóa khi đóng
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // LỌC TỨC THÌ (Instant Search)
  const filteredPosts = query.trim() === '' 
    ? [] 
    : posts.filter((post) => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.tool.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Chỉ hiện tối đa 8 kết quả cho đẹp

  return (
    <div className="relative z-[100]">
      {/* Lớp nền đen mờ (Backdrop Blur) */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Khung Command Palette */}
      <div className="fixed inset-0 z-[101] overflow-y-auto p-4 sm:p-6 md:p-20 pt-[10vh]">
        <div className="mx-auto max-w-2xl transform divide-y divide-slate-800 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-800/50 transition-all">
          
          {/* Ô nhập liệu */}
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-4 h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

          {/* Danh sách kết quả */}
          {query.trim() !== '' && (
            <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
              {filteredPosts.length > 0 ? (
                <ul className="space-y-1">
                  {filteredPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        onClick={() => setIsOpen(false)} // Đóng modal khi bấm vào link
                        className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 hover:bg-emerald-500/10 transition-colors"
                      >
                        <div className="flex flex-col truncate pr-4">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {post.tool !== "None" && (
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
                  <svg className="mx-auto h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="mt-4 font-semibold text-slate-300">No results found</p>
                  <p className="mt-2 text-slate-500">We couldn't find anything matching "{query}". Try a different term.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}