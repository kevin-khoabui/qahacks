"use client"; // Bắt buộc phải có vì chúng ta có xử lý logic chuyển hướng ở Client

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Lớp phòng thủ Client-side: Nếu phát hiện URL kết thúc bằng .md, tự động bốc slug ra và đá về trang bài viết đẹp
    const path = window.location.pathname;
    if (path.endsWith(".md")) {
      const cleanPath = path.replace("/content/posts/", "/posts/").replace(".md", "");
      router.replace(cleanPath);
    }
  }, [router]);

  return (
    <main className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-5">
        {/*Biểu tượng cảnh báo mang phong cách mã hóa.*/}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xl font-bold animate-pulse">
          ⚠️
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          404 - Page Not Found
        </h1>

        <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          The interview handbook or automation tutorial you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-slate-950 hover:opacity-90 transition-all shadow-lg shadow-emerald-500/10"
          >
            Back to Dashboard Hub
          </Link>
        </div>
      </div>
    </main>
  );
}