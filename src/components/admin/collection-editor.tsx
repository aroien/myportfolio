"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useOptimistic, useState, useTransition } from "react";
import { deleteItem, reorderItems, saveItem, type FormState } from "@/app/actions/admin";
import { collections } from "@/lib/collections";
import type { CollectionName } from "@/lib/types";
import { FormField, PageHeader, SaveButton, submitWithoutReset } from "./ui";

type Item = { id: string; featured?: boolean } & Record<string, unknown>;

export function CollectionEditor({ name, items }: { name: CollectionName; items: Item[] }) {
  const config = collections[name];
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [optimistic, setOptimistic] = useOptimistic(items);
  const [, startTransition] = useTransition();

  function move(index: number, dir: -1 | 1) {
    const next = [...optimistic];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      setOptimistic(next);
      await reorderItems(name, next.map((i) => i.id));
    });
  }

  function remove(item: Item) {
    if (!confirm(`Delete “${String(item[config.titleField])}”? This can't be undone.`)) return;
    startTransition(async () => {
      setOptimistic(optimistic.filter((i) => i.id !== item.id));
      await deleteItem(name, item.id);
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={config.label}
        description={config.description}
        action={
          <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">
            <Plus className="size-4" /> Add {config.singular.toLowerCase()}
          </button>
        }
      />

      {optimistic.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">
          No {config.label.toLowerCase()} yet. Click <span className="text-fg">Add {config.singular.toLowerCase()}</span> to create the first one.
        </div>
      ) : (
        <ul className="space-y-2">
          {optimistic.map((item, i) => (
            <motion.li layout key={item.id} className="group flex items-center gap-3 rounded-2xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-3 pl-4 transition-colors hover:border-slate-300">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-dim hover:text-fg disabled:opacity-20" aria-label="Move up"><ArrowUp className="size-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === optimistic.length - 1} className="rounded p-0.5 text-dim hover:text-fg disabled:opacity-20" aria-label="Move down"><ArrowDown className="size-4" /></button>
              </div>
              <button onClick={() => setEditing(item)} className="min-w-0 flex-1 text-left">
                <p className="flex items-center gap-2 truncate font-medium">
                  {item.featured && <Star className="size-3.5 shrink-0 fill-accent text-accent" />}
                  <span className="truncate">{String(item[config.titleField] ?? "Untitled")}</span>
                </p>
                <p className="truncate text-sm text-muted">{config.subtitle(item)}</p>
              </button>
              <button onClick={() => setEditing(item)} className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-fg" aria-label="Edit"><Pencil className="size-4" /></button>
              <button onClick={() => remove(item)} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="size-4" /></button>
            </motion.li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <ItemDrawer
            key={editing === "new" ? "new" : editing.id}
            name={name}
            item={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemDrawer({ name, item, onClose }: { name: CollectionName; item: Item | null; onClose: () => void }) {
  const config = collections[name];
  const [state, action, pending] = useActionState<FormState, FormData>(saveItem.bind(null, name, item?.id ?? null), undefined);

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal
        aria-label={item ? `Edit ${config.singular}` : `New ${config.singular}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-surface"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-semibold">{item ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-fg" aria-label="Close"><X className="size-5" /></button>
        </div>
        <form onSubmit={submitWithoutReset(action)} className="flex min-h-0 flex-1 flex-col">
          <div className="grid flex-1 content-start gap-4 overflow-y-auto p-6 sm:grid-cols-2">
            {config.fields.map((field) => (
              <FormField key={field.name} field={field} defaultValue={item?.[field.name]} error={state?.errors?.[field.name]} />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
            <p className="text-sm text-red-600" role="alert">{state?.error}</p>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-slate-100">Cancel</button>
              <SaveButton pending={pending} label={item ? "Save & publish" : `Add ${config.singular.toLowerCase()}`} />
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
