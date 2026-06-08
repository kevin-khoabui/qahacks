'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hàm tự động nối số trang vào URL mà không làm mất các bộ lọc cũ
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Nếu chỉ có 1 trang thì giấu thanh phân trang đi cho gọn
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-slate-800/60">
      {/* Nút Previous */}
      {currentPage > 1 ? (
        <Link 
          href={createPageURL(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Prev
        </Link>
      ) : (
        <button disabled className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-900/50 border border-slate-800 rounded-lg cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Prev
        </button>
      )}

      {/* Thông tin số trang */}
      <span className="text-sm font-medium text-slate-400">
        Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
      </span>

      {/* Nút Next */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageURL(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      ) : (
        <button disabled className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-900/50 border border-slate-800 rounded-lg cursor-not-allowed">
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
}