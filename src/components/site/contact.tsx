"use client";

import { Check, Loader2 } from "lucide-react";
import { startTransition, useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";

const field =
  "w-full rounded-md border border-rule bg-card px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-4 focus:border-ember focus:ring-3 focus:ring-ember/15";

export function ContactForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, undefined);

  return (
    <div className="rounded-xl border border-rule bg-card p-5 shadow-sm shadow-ink/5 sm:p-6">
      <p className="leading-relaxed text-ink-2">
        Have a role, project or research collaboration in mind? Send me a message
        {email && (
          <>
            {" "}or email{" "}
            <a href={`mailto:${email}`} className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:text-ember hover:decoration-ember">
              {email}
            </a>
          </>
        )}
        .
      </p>

      {state?.ok ? (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-ink">
          <Check className="size-4" /> Thanks! Your message was sent. I&apos;ll reply soon.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            startTransition(() => action(form));
          }}
          className="mt-6 space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="sr-only">Name</span>
              <input name="name" required autoComplete="name" placeholder="Name" className={field} />
            </label>
            <label>
              <span className="sr-only">Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
            </label>
          </div>
          <label className="block">
            <span className="sr-only">Subject</span>
            <input name="subject" placeholder="Subject (optional)" className={field} />
          </label>
          <label className="block">
            <span className="sr-only">Message</span>
            <textarea name="message" required rows={4} placeholder="Message" className={`${field} resize-y`} />
          </label>
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {state?.error && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
          <button disabled={pending} className="inline-flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-on-ember transition hover:bg-ember-deep disabled:opacity-60">
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
