"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const R = 20;
const C = 2 * Math.PI * R;

/** Floating button that appears after scrolling, with a reading-progress ring. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setVisible(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className={`group fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full border border-rule bg-card/90 text-ink-2 shadow-lg shadow-ink/10 backdrop-blur transition-all duration-300 hover:text-ember md:right-8 md:bottom-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" stroke="var(--rule)" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--ember)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <ArrowUp className="relative size-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
