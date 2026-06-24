// components/BlogContent.jsx
"use client";

import { useState } from "react";
import RichText from "@/components/RichText";

export default function BlogContent({ post }) {
  const [lang, setLang] = useState("en");

  const title = lang === "en" ? post.titleEnglish : post.titleTelugu;
  const body = lang === "en" ? post.bodyEnglish : post.bodyTelugu;

  return (
    <>
      {/* Language toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-[var(--color-forest)]/20 overflow-hidden">
          <button
            onClick={() => setLang("en")}
            className={`px-5 py-2 text-sm font-semibold transition-colors ${
              lang === "en"
                ? "bg-[var(--color-forest)] text-[var(--color-cream)]"
                : "bg-transparent text-[var(--color-forest)] hover:bg-[var(--color-forest)]/5"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("te")}
            className={`px-5 py-2 text-sm font-semibold transition-colors ${
              lang === "te"
                ? "bg-[var(--color-forest)] text-[var(--color-cream)]"
                : "bg-transparent text-[var(--color-forest)] hover:bg-[var(--color-forest)]/5"
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Body wrapped in a white card */}
      <div className="bg-white rounded-lg border border-[var(--color-forest)]/10 shadow-sm p-8 sm:p-10">
        <h1 className="text-4xl sm:text-5xl mb-6 leading-tight">{title}</h1>
        <article className="text-lg leading-relaxed max-w-none">
          <RichText content={body} />
        </article>
      </div>
    </>
  );
}