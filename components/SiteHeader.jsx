// components/SiteHeader.jsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const RESOURCES = [
  { href: "/sermons", label: "Sermons" },
  { href: "/blog", label: "Blogs" },
];

const JOIN = [
  { href: "/join/member", label: "Become a Member" },
  { href: "/join/visitor", label: "Visitor" },
];

export default function SiteHeader({ churchName }) {
  const [open, setOpen] = useState(false); // mobile menu
  const [resOpen, setResOpen] = useState(false); // Resources dropdown
  const [joinOpen, setJoinOpen] = useState(false); // Join Us dropdown
  const resRef = useRef(null);
  const joinRef = useRef(null);

  // Close desktop dropdowns when clicking outside them
  useEffect(() => {
    function handleClick(e) {
      if (resRef.current && !resRef.current.contains(e.target)) {
        setResOpen(false);
      }
      if (joinRef.current && !joinRef.current.contains(e.target)) {
        setJoinOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkClass =
    "text-base font-semibold tracking-wide text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-gold)] border-b border-[var(--color-forest)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-32">
          {/* Logo (left) */}
          <Link href="/" aria-label={churchName || "Elim House of Worship"} className="inline-block">
            <img
              src="/pic1.png"
              alt={churchName || "Elim House of Worship"}
              className="h-16 w-16 md:h-28 md:w-28 object-contain"
            />
          </Link>

          {/* Desktop nav (right) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={linkClass}>
              Home
            </Link>

            {/* Resources dropdown */}
            <div className="relative" ref={resRef}>
              <button
                type="button"
                onClick={() => {
                  setResOpen((v) => !v);
                  setJoinOpen(false);
                }}
                className={linkClass}
                aria-expanded={resOpen}
                aria-haspopup="true"
              >
                Resources
              </button>
              {resOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-[var(--color-cream)] shadow-xl overflow-hidden">
                  {RESOURCES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setResOpen(false)}
                      className="block px-6 py-5 text-center text-base font-medium text-[var(--color-forest-dark)] hover:bg-[var(--color-forest)]/5 hover:text-[var(--color-clay)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/events" className={linkClass}>
              Events
            </Link>
            <Link href="/ministries" className={linkClass}>
              Ministries
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>

            {/* Join Us dropdown */}
            <div className="relative" ref={joinRef}>
              <button
                type="button"
                onClick={() => {
                  setJoinOpen((v) => !v);
                  setResOpen(false);
                }}
                className={linkClass}
                aria-expanded={joinOpen}
                aria-haspopup="true"
              >
                Join Us
              </button>
              {joinOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-[var(--color-cream)] shadow-xl overflow-hidden">
                  {JOIN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setJoinOpen(false)}
                      className="block px-6 py-5 text-center text-base font-medium text-[var(--color-forest-dark)] hover:bg-[var(--color-forest)]/5 hover:text-[var(--color-clay)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-50 p-3 -mr-3 text-[var(--color-forest-dark)]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5 pointer-events-none" />
            <span className="block w-6 h-0.5 bg-current mb-1.5 pointer-events-none" />
            <span className="block w-6 h-0.5 bg-current pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-[var(--color-forest)]/20 bg-[var(--color-gold)]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
            >
              Home
            </Link>

            {/* Resources group on mobile */}
            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-forest-dark)]/60">
              Resources
            </p>
            {RESOURCES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 pl-3 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
            >
              Events
            </Link>
            <Link
              href="/ministries"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
            >
              Ministries
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
            >
              About
            </Link>

            {/* Join Us group on mobile */}
            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-forest-dark)]/60">
              Join Us
            </p>
            {JOIN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 pl-3 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}