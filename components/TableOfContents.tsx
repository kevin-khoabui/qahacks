"use client";

import { useEffect, useState, useRef } from "react";

interface MenuItem {
  id: string;
  label: string;
  level: number;
}

export default function TableOfContents() {
  const [activeId, setActiveId] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(true); // Mặc định luôn mở trên mobile
  const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});

  useEffect(() => {
    const articleElement = document.querySelector("article");
    if (!articleElement) return;

    const headingElements = Array.from(
      articleElement.querySelectorAll("h2, h3")
    ) as HTMLElement[];

    const dynamicMenuItems: MenuItem[] = [];
    const validIds: string[] = [];

    headingElements.forEach((el) => {
      const text = el.innerText || "";
      const textLower = text.toLowerCase().trim();
      const id = el.id;

      if (!id) return;

      // 🛠️ BỘ LỌC TỐI GIẢN CHỈ TÌM BÀI GỘP: Chỉ bốc duy nhất các tiêu đề bắt đầu bằng chữ "Question X"
      if (textLower.match(/^question\s+\d+/i)) {
        dynamicMenuItems.push({ 
          id, 
          label: text, // Giữ nguyên chữ "Question 1", "Question 2"...
          level: el.tagName === "H2" ? 2 : 3 
        });
        validIds.push(id);
      }
    });

    setMenuItems(dynamicMenuItems);

    if (validIds.length > 0) {
      setActiveId(validIds[0]);
    }

    const callback = (headings: IntersectionObserverEntry[]) => {
      headings.forEach((heading) => {
        headingElementsRef.current[heading.target.id] = heading;
      });

      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting
      );

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -50% 0px",
      threshold: [0, 0.2, 0.5, 1.0],
    });

    validIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 🎯 CHỐT CHẶN VÀNG CỦA SẾP: 
  // Nếu không phải bài gộp (mảng rỗng) hoặc chỉ có đúng 1 câu hỏi -> ẨN SẠCH, TRẢ VỀ NULL KHÔNG RENDER GÌ CẢ
  if (menuItems.length <= 1) return null;

  return (
    <div className="bg-slate-900/30 lg:bg-transparent p-4 lg:p-0 rounded-xl border border-slate-800/60 lg:border-none space-y-3 w-full">
      {/* HEADER MỤC LỤC */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full lg:cursor-default flex items-center justify-between lg:justify-start gap-1.5 border-b border-slate-900 pb-2.5 text-left focus:outline-none group"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          📍 On This Page
        </h3>
        <svg 
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 lg:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* DANH SÁCH CHỈ HIỂN THỊ KHI CÓ TỪ 2 CÂU TRỞ LÊN */}
      <nav className={`space-y-1.5 pr-1 transition-all duration-200 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {menuItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`block transition-all duration-150 rounded-lg tracking-wide text-xs py-1.5 font-semibold pl-2 text-slate-400 hover:text-slate-200 ${
                isActive
                  ? "text-teal-400 font-bold bg-teal-500/5 border-l-2 border-teal-400 pl-2 rounded-l-none"
                  : ""
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}