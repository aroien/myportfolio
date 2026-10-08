import type { SVGProps } from "react";

/**
 * Portfolio mark: an "M" made of two overlapping peaks on an ember gradient.
 * Keep in sync with app/icon.svg (the favicon).
 */
export function Logo({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  // Decorative unless a title is given (e.g. when the logo is the only content of a link).
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  return (
    <svg viewBox="0 0 64 64" {...a11y} {...props}>
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-gradient)" />
      <path d="M29 47 40.5 17 52 47" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 47 23.5 17 35 47" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
