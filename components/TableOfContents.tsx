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
  const [isOpen, setIsOpen] = useState(true);
  const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const articleElement = document.querySelector("article");
    if (!articleElement) return;

    // Quét toàn bộ H2 và H3 trong bài viết
    const headingElements = Array.from(
      articleElement.querySelectorAll("h2, h3")
    ) as HTMLElement[];

    const dynamicMenuItems: MenuItem[] = [];
    const validIds: string[] = [];

    headingElements.forEach((el) => {
      const text = el.innerText || "";
      const id = el.id;

      if (!id) return;

      // 🚀 TỐI ƯU: Gọt sạch dấu hai chấm ":" ở cuối chuỗi tiêu đề nếu có
      const cleanLabel = text.trim().replace(/:$/, "");

      dynamicMenuItems.push({
        id,
        label: cleanLabel,
        level: el.tagName === "H2" ? 2 : 3
      });
      validIds.push(id);
    });

    setMenuItems(dynamicMenuItems);

    if (validIds.length > 0) {
      setActiveId(validIds[0]);
    }

    const callback = (headings: IntersectionObserverEntry[]) => {
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
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

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
    <div className="bg-slate-900/30 lg:bg-transparent p-4 lg:p-0 rounded-xl border border-slate-800/60 lg:border-none space-y-3 w-full sticky top-28 hierarchy-toc">
      
      {/* HEADER MỤC LỤC */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full lg:cursor-default flex items-center justify-between lg:justify-start gap-1.5 border-b border-slate-900 pb-2.5 text-left focus:outline-none group"
      >
<h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 whitespace-nowrap mb-2">
  <span className="text-emerald-500">📍</span> On This Page
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
                isClickScrolling.current = true;
                setActiveId(item.id);

                const targetElement = document.getElementById(item.id);
                if (targetElement) {
                  // Cuộn mượt và bù trừ khoảng cách Y hợp lý cho menu
                  const offset = 100;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = targetElement.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                }

                setTimeout(() => {
                  isClickScrolling.current = false;
                }, 600);

                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              // 🚀 ĐỒNG BỘ: Chuyển hẳn từ màu Teal cũ sang màu Emerald chuẩn thương hiệu
             className={`block transition-all duration-150 rounded-md tracking-normal text-sm py-2 font-medium break-words leading-snug ${
                item.level === 3 
                  ? "pl-6 text-[13px] text-slate-500 hover:text-slate-300" 
                  : "pl-3 text-slate-400 hover:text-slate-200"
              } ${
                isActive
                  ? "text-emerald-400 font-bold bg-emerald-500/5 border-l-2 border-emerald-400 rounded-l-none!"
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