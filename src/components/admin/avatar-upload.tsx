"use client";

import { Loader2, Trash2, Upload, User } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { removeAvatar, uploadAvatar } from "@/app/actions/admin";

const SIZE = 512;

/** Center-crop to a square and downscale to 512px JPEG in the browser. */
async function toSquareJpeg(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That file isn't a valid image. Please choose a JPG, PNG or WebP.");
  });
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.min(SIZE, side);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser can't process images.");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't process the image."))), "image/jpeg", 0.88),
  );
}

export function AvatarUpload({ current }: { current: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(current);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    startTransition(async () => {
      try {
        const blob = await toSquareJpeg(file);
        const form = new FormData();
        form.append("file", blob, "avatar.jpg");
        const res = await uploadAvatar(form);
        if (res.error) setError(res.error);
        else if (res.url) setPreview(res.url);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function onRemove() {
    if (!confirm("Remove your profile photo?")) return;
    startTransition(async () => {
      await removeAvatar();
      setPreview("");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
      <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-bg">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Profile photo" className="size-full object-cover" />
        ) : (
          <User className="size-8 text-dim" />
        )}
        {pending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            <Upload className="size-4" /> {preview ? "Change photo" : "Upload photo"}
          </button>
          {preview && (
            <button
              type="button"
              disabled={pending}
              onClick={onRemove}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="size-4" /> Remove
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-dim">JPG, PNG or WebP. It&apos;s cropped to a square and saved immediately.</p>
        {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
