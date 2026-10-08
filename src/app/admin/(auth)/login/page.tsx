import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="admin-theme relative flex items-center justify-center overflow-hidden px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        <div className="absolute top-1/4 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-blue-200/60 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-5 size-12 shadow-lg shadow-orange-500/20 rounded-[15px]" />
          <h1 className="font-display text-3xl font-bold">Admin panel</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your portfolio.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-dim">
          <Link href="/" className="hover:text-fg">← Back to site</Link>
        </p>
      </div>
    </main>
  );
}
