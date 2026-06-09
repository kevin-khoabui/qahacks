"use client";

import { useEffect, useState, useRef } from "react";

export default function TableOfContents() {
  const [activeId, setActiveId] = useState("overview");
  // Sử dụng useRef để lưu trữ trạng thái hiển thị của từng phần nhằm tính toán chính xác nhất
  const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});

  useEffect(() => {
    const callback = (headings: IntersectionObserverEntry[]) => {
      // Cập nhật trạng thái hiển thị mới nhất của các block tiêu đề vào ref
      headings.forEach((heading) => {
        headingElementsRef.current[heading.target.id] = heading;
      });

      // Lọc ra danh sách các phần hiện đang nằm trong màn hình
      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting
      );

      if (visibleHeadings.length === 1) {
        // Nếu chỉ có duy nhất 1 phần xuất hiện, kích hoạt active mục đó luôn
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        // Nếu có nhiều phần cùng xuất hiện (ví dụ phần Question ngắn nằm cạnh phần Answer),
        // ưu tiên lấy phần nào có vị trí nằm cao hơn gần mép trên cùng màn hình (top nhỏ hơn)
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    // Cấu hình vùng quét thông minh: Bao phủ rộng hơn từ đỉnh màn hình xuống gần đáy
    const observer = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -40% 0px",
      threshold: [0, 0.2, 0.5, 1.0], // Quét nhạy hơn ở nhiều ngưỡng hiển thị khác nhau
    });

    const ids = ["overview", "interview-question", "expert-answer", "speaking-blueprint"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { id: "overview", label: "1. Overview" },
    { id: "interview-question", label: "2. Interview Question" },
    { id: "expert-answer", label: "3. Expert Answer" },
    { id: "speaking-blueprint", label: "4. Speaking Blueprint 🔥" },
  ];

  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📍 On This Page</h3>
      <nav className="space-y-2 text-sm">
        {menuItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block pl-2 border-l-2 transition-all duration-200 ${
                isActive
                  ? "text-teal-400 font-bold border-teal-400 bg-teal-500/5 py-0.5 rounded-r"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
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