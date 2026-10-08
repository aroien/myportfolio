"use client";

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string };

/** Desktop section nav; highlights the section currently in view. */
export function SideNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="In-page" className="hidden lg:block">
      <ul className="mt-14 w-max space-y-1 short:mt-8">
        {items.map(({ id, label }) => {
          const on = active === id;
          return (
            <li key={id}>
              <a href={`#${id}`} className="group flex items-center py-2 short:py-1.5" aria-current={on ? "true" : undefined}>
                <span className={`mr-4 h-px transition-all duration-300 ${on ? "w-16 bg-ember" : "w-8 bg-rule-strong group-hover:w-16 group-hover:bg-ember"}`} />
                <span className={`text-xs font-semibold tracking-widest uppercase transition-colors ${on ? "text-ember" : "text-ink-4 group-hover:text-ink"}`}>
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
