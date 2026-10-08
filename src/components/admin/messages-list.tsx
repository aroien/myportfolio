"use client";

import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { deleteMessage, setMessageRead } from "@/app/actions/admin";
import type { Message } from "@/lib/types";
import { PageHeader } from "./ui";

const dateFmt = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export function MessagesList({ messages }: { messages: Message[] }) {
  const [list, setList] = useOptimistic(messages);
  const [openId, setOpenId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const unread = list.filter((m) => !m.read).length;

  function toggle(m: Message) {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && !m.read) {
      startTransition(async () => {
        setList(list.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
        await setMessageRead(m.id, true);
      });
    }
  }

  function markUnread(m: Message) {
    startTransition(async () => {
      setList(list.map((x) => (x.id === m.id ? { ...x, read: false } : x)));
      await setMessageRead(m.id, false);
    });
  }

  function remove(m: Message) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    startTransition(async () => {
      setList(list.filter((x) => x.id !== m.id));
      await deleteMessage(m.id);
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Messages" description={`${list.length} total · ${unread} unread. Sent from the contact form on your site.`} />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">No messages yet.</div>
      ) : (
        <ul className="space-y-2">
          {list.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id} className={`overflow-hidden rounded-2xl border bg-surface shadow-sm shadow-slate-200/50 transition-colors ${open ? "border-slate-300" : "border-line"}`}>
                <button onClick={() => toggle(m)} className="flex w-full items-center gap-4 p-4 text-left">
                  {m.read ? <MailOpen className="size-4 shrink-0 text-dim" /> : <Mail className="size-4 shrink-0 text-accent" />}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate ${m.read ? "text-muted" : "font-semibold"}`}>
                      {m.name} <span className="font-normal text-dim">· {m.email}</span>
                    </p>
                    <p className="truncate text-sm text-muted">{m.subject || m.body}</p>
                  </div>
                  <time suppressHydrationWarning className="shrink-0 text-xs text-dim">{dateFmt.format(new Date(m.createdAt))}</time>
                </button>
                {open && (
                  <div className="border-t border-line p-5">
                    {m.subject && <p className="mb-3 font-medium">{m.subject}</p>}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{m.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
                        <Reply className="size-4" /> Reply
                      </a>
                      <button onClick={() => markUnread(m)} className="rounded-xl border border-line px-4 py-2 text-sm hover:bg-slate-100">Mark unread</button>
                      <button onClick={() => remove(m)} className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="size-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
