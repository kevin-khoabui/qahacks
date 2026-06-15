'use client';

// 1. Import Icon Search từ thư viện vừa cài
import { Search } from 'lucide-react';

export default function SearchBar() {
  // Hàm phát tín hiệu để mở Command Palette (Màn hình tối)
  const openCommandPalette = () => {
    // Phát tán một Custom Event để file layout tóm lấy và mở modal
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <div
      onClick={openCommandPalette}
      className="max-w-xl mx-auto relative group cursor-pointer"
    >
      {/* VÙNG ĐIỀU HƯỚNG MA THUẬT (MỒI NHỬ): 
         Sử dụng flex để xếp Icon và Chữ nằm ngang hàng
      */}
      <div className="
        flex w-full items-center gap-3.5
        pl-6 pr-24 py-4 
        bg-slate-900/80 
        border border-slate-800 rounded-2xl 
        text-slate-500 
        group-hover:text-slate-200 
        group-hover:border-emerald-500/50 
        group-hover:ring-2 group-hover:ring-emerald-500/20 
        transition-all duration-150 
        shadow-xl shadow-slate-950/20
        select-none
      ">
        {/* 2. NHÚNG ICON VÀO ĐÂY VỚI MÀU Emerald CỰC ĐẸP */}
        <Search className="h-5 w-5 text-emerald-500/80 group-hover:text-emerald-400 group-hover:animate-pulse transition-colors" />

        <span className="text-sm">
          Search frameworks, roles, or topics...
        </span>
      </div>

      {/* PHÍM TẮT DỰ PHÒNG Ở BÊN PHẢI */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="
          hidden sm:block 
          text-xs font-semibold text-slate-500 
          border border-slate-800 
          bg-slate-900 rounded-lg 
          px-2.5 py-1.5 
          group-hover:border-emerald-500/30 
          transition-colors shadow-sm
        ">
          Ctrl K
        </span>
      </div>
    </div>
  );
}