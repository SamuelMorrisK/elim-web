// components/Gallery.jsx
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getStrapiMedia } from "@/lib/strapi";

export default function Gallery({ images, title }) {
  const [current, setCurrent] = useState(0); // carousel position
  const [lightbox, setLightbox] = useState(false); // fullscreen open?

  const count = images?.length || 0;

  const go = useCallback(
    (i) => setCurrent(((i % count) + count) % count),
    [count]
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Keyboard: arrows navigate; Esc closes lightbox
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightbox(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Lock background scroll while lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  if (!images || count === 0) return null;

  const img = images[current];
  const carouselSrc = getStrapiMedia(img.formats?.large?.url || img.url);
  const fullSrc = getStrapiMedia(img.url);

  return (
    <>
      {/* Carousel */}
      <div className="relative">
        {/* Stage — click to enlarge */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative block w-full aspect-video rounded-lg overflow-hidden bg-[var(--color-forest)]/10 border border-[var(--color-forest)]/10 shadow-sm cursor-zoom-in"
          aria-label="Enlarge photo"
        >
          <Image
            src={carouselSrc}
            alt={img.alternativeText || `${title || "Event"} photo ${current + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
            priority
          />
        </button>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-cream)]/90 text-[var(--color-forest-dark)] shadow-md hover:bg-[var(--color-cream)] transition-colors text-2xl leading-none"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-cream)]/90 text-[var(--color-forest-dark)] shadow-md hover:bg-[var(--color-cream)] transition-colors text-2xl leading-none"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-[var(--color-clay)]"
                  : "w-2 bg-[var(--color-forest)]/25 hover:bg-[var(--color-forest)]/40"
              }`}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none z-10"
            aria-label="Close"
          >
            ×
          </button>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/80 hover:text-white text-4xl leading-none z-10 px-2"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullSrc}
              alt={img.alternativeText || `${title || "Event"} photo ${current + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/80 hover:text-white text-4xl leading-none z-10 px-2"
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {current + 1} / {count}
          </div>
        </div>
      )}
    </>
  );
}