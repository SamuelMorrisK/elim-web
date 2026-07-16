// components/RecognitionsButton.jsx
"use client";

import { useState, useEffect } from "react";
import Gallery from "@/components/Gallery";

export default function RecognitionsButton({ images, name }) {
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

  if (!images || images.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors border-b-2 border-[var(--color-gold)] pb-0.5"
      >
        View Recognitions
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-[var(--color-cream)] rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">{name ? `${name} — Recognitions` : "Recognitions"}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--color-forest-dark)]/60 hover:text-[var(--color-forest-dark)] text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <Gallery images={images} title={name || "Recognition"} />
          </div>
        </div>
      )}
    </>
  );
}