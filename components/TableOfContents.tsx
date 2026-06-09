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
  
  // 🎯 CỜ CHẶN CHỐNG NHẢY ITEM KHI ĐANG CLICK CUỘN TRANG
  const isClickScrolling = useRef(false);

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

      // 🛠️ BỘ LỌC TỐI GIẢN CHỈ TÌM BÀI GỘP
      if (textLower.match(/^question\s+\d+/i)) {
        dynamicMenuItems.push({ 
          id, 
          label: text, 
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
      // 🛑 NẾU NGƯỜI DÙNG ĐANG CLICK CUỘN, BỎ QUA KHÔNG CHO OBSERVER TỰ ĐỘNG HIGHLIGHT SAI
      if (isClickScrolling.current) return;

      headings.forEach((heading) => {
        headingElementsRef.current[heading.target.id] = heading;
      });

      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting
      );

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleVisibleHeadings.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    // 🛠️ TINH CHỈNH ROOTMARGIN: 
    // - Hạ biên trên xuống -100px (để bù trừ hẳn cho Header cản trở)
    // - Co hẹp biên dưới lại -20% để ép vùng quét tập trung vào nửa trên màn hình
    const observer = new IntersectionObserver(callback, {
      rootMargin: "-100px 0px -65% 0px",
      threshold: [0, 0.2, 0.5, 1.0],
    });

    validIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
      
      {/* DANH SÁCH MỤC LỤC */}
      <nav className={`space-y-1.5 pr-1 transition-all duration-200 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {menuItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                
                // 1. Khóa bộ tự động scan của IntersectionObserver lại
                isClickScrolling.current = true;
                
                // 2. Ép giao diện highlight ngay lập tức mục vừa bấm
                setActiveId(item.id);

                // 3. Tiến hành cuộn mượt đến đích
                const targetElement = document.getElementById(item.id);
                if (targetElement) {
                  targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }

                // 4. Mở khóa cờ sau khi hoạt ảnh cuộn hoàn tất (tầm 600ms)
                setTimeout(() => {
                  isClickScrolling.current = false;
                }, 600);

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