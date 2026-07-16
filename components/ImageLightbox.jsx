// components/ImageLightbox.jsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function ImageLightbox({ src, alt, width, height }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full rounded-lg overflow-hidden border border-[var(--color-forest)]/10 shadow-sm bg-[var(--color-forest)]/5 cursor-zoom-in"
        aria-label="Enlarge document"
      >
        <Image
          src={src}
          alt={alt || "Document"}
          width={width || 1000}
          height={height || 1400}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-auto object-contain"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none z-10"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt || "Document"}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}