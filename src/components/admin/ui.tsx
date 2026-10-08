"use client";

import { Check, Loader2 } from "lucide-react";
import { startTransition, useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Field } from "@/lib/collections";

/**
 * Submit handler that dispatches a useActionState action without React's
 * automatic form reset, so typed values survive validation errors.
 */
export function submitWithoutReset(dispatch: (form: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => dispatch(form));
  };
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function FormField({
  field,
  defaultValue,
  error,
}: {
  field: Field;
  defaultValue: unknown;
  error?: string;
}) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name, "aria-invalid": error ? true : undefined, placeholder: field.placeholder };

  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-bg px-4 py-3 text-sm sm:col-span-2">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(defaultValue)} className="size-4 accent-accent" />
        {field.label}
      </label>
    );
  }

  const str = Array.isArray(defaultValue)
    ? defaultValue.join(field.type === "lines" ? "\n" : ", ")
    : String(defaultValue ?? "");

  let control: ReactNode;
  if (field.type === "textarea" || field.type === "lines") {
    control = <textarea {...common} defaultValue={str} rows={field.type === "lines" ? 5 : 4} className="input resize-y" />;
  } else if (field.type === "select") {
    control = (
      <select {...common} defaultValue={str} className="input">
        <option value="">—</option>
        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        {str && !field.options?.includes(str) && <option value={str}>{str}</option>}
      </select>
    );
  } else {
    control = (
      <input
        {...common}
        type={field.type === "month" ? "month" : "text"}
        inputMode={field.type === "url" ? "url" : undefined}
        defaultValue={str}
        required={field.required}
        className="input"
      />
    );
  }

  return (
    <div className={field.half ? "" : "sm:col-span-2"}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-muted">
        <span>
          {field.label}
          {field.required && <span className="text-accent"> *</span>}
        </span>
        {field.help && <span className="text-xs font-normal text-dim">{field.help}</span>}
      </label>
      {control}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function SaveButton({ pending, savedAt, label = "Save changes" }: { pending: boolean; savedAt?: number; label?: string }) {
  const [expiredAt, setExpiredAt] = useState<number>();
  const showSaved = Boolean(savedAt) && savedAt !== expiredAt;
  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setExpiredAt(savedAt), 2000);
    return () => clearTimeout(t);
  }, [savedAt]);

  return (
    <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
      {pending ? <Loader2 className="size-4 animate-spin" /> : showSaved ? <Check className="size-4" /> : null}
      {pending ? "Saving…" : showSaved ? "Saved & published" : label}
    </button>
  );
}
