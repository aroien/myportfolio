"use client";

import { Loader2, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { submitWithoutReset } from "@/components/admin/ui";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-4 rounded-3xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-6 backdrop-blur">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-muted">Email</span>
        <input name="email" type="email" autoComplete="username" required autoFocus className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-muted">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className="input" />
      </label>
      {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Sign in
      </button>
    </form>
  );
}
