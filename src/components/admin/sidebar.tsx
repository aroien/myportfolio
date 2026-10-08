"use client";

import { Briefcase, ExternalLink, FileText, FolderKanban, LayoutDashboard, LogOut, Mail, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/logo";

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile & skills", Icon: User },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", Icon: Briefcase },
  { href: "/admin/publications", label: "Research", Icon: FileText },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur md:h-dvh md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-4 py-4 md:px-5 md:py-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo className="size-8" />
          <span className="font-display font-semibold">Portfolio admin</span>
        </Link>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg border border-line p-2 md:hidden" aria-label="Toggle navigation">
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <nav className={`${open ? "flex" : "hidden"} flex-col gap-1 px-3 pb-4 md:flex md:h-[calc(100dvh-5.5rem)]`}>
        {links.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-accent/10 font-medium text-accent" : "text-muted hover:bg-slate-100 hover:text-fg"}`}
            >
              <Icon className="size-4" /> {label}
            </Link>
          );
        })}
        <div className="mt-auto space-y-1 border-t border-line pt-3">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-slate-100 hover:text-fg">
            <ExternalLink className="size-4" /> View live site
          </a>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-red-50 hover:text-red-600">
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
