"use client";

import { ExternalLink, FileText, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { removeResume, setResumeLink, uploadResume } from "@/app/actions/admin";

const MAX_BYTES = 4 * 1024 * 1024;

/** Upload a résumé PDF to MongoDB, or point the Resume button at a link instead. */
export function ResumeUpload({ current }: { current: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(current);
  const [link, setLink] = useState(current.startsWith("/api/resume") ? "" : current);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const uploaded = url.startsWith("/api/resume");

  function onFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    if (file.type && file.type !== "application/pdf") return setError("Please choose a PDF file.");
    if (file.size > MAX_BYTES) return setError("PDF is too large (max 4 MB). Try exporting it with smaller images.");
    startTransition(async () => {
      const form = new FormData();
      form.append("file", file);
      const res = await uploadResume(form).catch((e: Error) => ({ error: e.message, url: undefined }));
      if (res.error) setError(res.error);
      else if (res.url) {
        setUrl(res.url);
        setLink("");
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function onSaveLink() {
    setError(undefined);
    startTransition(async () => {
      const res = await setResumeLink(link);
      if (res.error) setError(res.error);
      else setUrl(link.trim());
    });
  }

  function onRemove() {
    if (!confirm("Remove your résumé? The Resume button will be hidden on the site.")) return;
    startTransition(async () => {
      await removeResume();
      setUrl("");
      setLink("");
    });
  }

  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-bg p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          {pending ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {uploaded ? "Uploaded PDF" : url ? "Linked résumé" : "No résumé yet"}
          </p>
          <p className="truncate text-xs text-dim">{url || "Upload a PDF or add a link below."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm hover:bg-slate-100">
              <ExternalLink className="size-4" /> View
            </a>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            <Upload className="size-4" /> {uploaded ? "Replace PDF" : "Upload PDF"}
          </button>
          {url && (
            <button
              type="button"
              disabled={pending}
              onClick={onRemove}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="size-4" /> Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <div>
        <label htmlFor="resume-link" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-muted">
          <Link2 className="size-4" /> Or use a link instead
          <span className="ml-auto text-xs font-normal text-dim">e.g. Google Drive, or /resume.pdf</span>
        </label>
        <div className="flex gap-2">
          <input
            id="resume-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveLink();
              }
            }}
            placeholder="https://…"
            className="input"
          />
          <button
            type="button"
            disabled={pending || link.trim() === (uploaded ? "" : url)}
            onClick={onSaveLink}
            className="shrink-0 rounded-xl border border-line px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            Save link
          </button>
        </div>
      </div>

      <p className="text-xs text-dim">PDF only, up to 4 MB. Changes go live immediately; no need to click Save changes.</p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
