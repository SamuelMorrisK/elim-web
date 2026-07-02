"use client";

import { useState, useRef, useEffect } from "react";

export default function ShareButton({ url, title, label = "Share" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const menuRef = useRef(null);

  // Detect native share support after mount (avoids SSR mismatch)
  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  // Close the desktop menu when clicking outside it
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const shareText = title || "";
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const targets = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(
        `${shareText}\n\n${url}`
      )}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      key: "email",
      label: "Email",
      href: `mailto:?subject=${encodedText}&body=${encodeURIComponent(
        `${shareText}\n\n${url}`
      )}`,
    },
  ];

  async function handleNativeShare() {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: shareText,
        url,
      });
    } catch {
      // User cancelled or share failed
    }
  }

  async function handleCopy() {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      setOpen(false);
    } catch {
      setCopied(false);
    }
  }

  // Mobile / supported browsers: use the native share sheet
  if (canNativeShare) {
    return (
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share this page"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
      >
        <ShareIcon />
        {label}
      </button>
    );
  }

  // Desktop fallback
  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Share this page"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
      >
        <ShareIcon />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-md border border-[var(--color-forest)]/10 bg-[var(--color-cream)] shadow-xl z-50">
          <button
            type="button"
            onClick={handleCopy}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-[var(--color-forest-dark)] hover:bg-[var(--color-forest)]/5 transition-colors"
          >
            {copied ? "✓ Link copied" : "Copy link"}
          </button>

          {targets.map((target) => (
            <a
              key={target.key}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-[var(--color-forest-dark)] hover:bg-[var(--color-forest)]/5 transition-colors"
            >
              {target.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}