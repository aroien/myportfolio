"use client";

import { useEffect, useRef } from "react";

const dots = (color: string) => `radial-gradient(${color} 1px, transparent 1.3px)`;

/**
 * Page background: a fine dot grid ("engineering paper") with a warm glow,
 * plus a cursor spotlight that lights the dots up in ember orange.
 * The spotlight only runs on mouse/trackpad devices without reduced motion.
 */
export function Backdrop() {
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spot.current;
    if (!el) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => (el.style.opacity = "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Dot grid, fading out toward the bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dots("var(--dot)"),
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 90% 75% at 25% 10%, black 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 25% 10%, black 35%, transparent 100%)",
        }}
      />
      {/* Warm glow behind the sidebar */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(48rem 36rem at 0% 0%, var(--glow), transparent 70%)" }} />
      {/* Cursor spotlight: ember dots + soft glow around the pointer */}
      <div ref={spot} className="absolute inset-0 opacity-0 transition-opacity duration-500">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dots("var(--ember)"),
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(180px circle at var(--x, -999px) var(--y, -999px), black, transparent)",
            WebkitMaskImage: "radial-gradient(180px circle at var(--x, -999px) var(--y, -999px), black, transparent)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(420px circle at var(--x, -999px) var(--y, -999px), var(--glow), transparent 70%)" }} />
      </div>
    </div>
  );
}
