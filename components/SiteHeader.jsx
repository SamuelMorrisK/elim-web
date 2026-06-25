// components/SiteHeader.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const RESOURCES = [
  { href: "/sermons", label: "Sermons" },
  { href: "/blog", label: "Blogs" },
];

const JOIN = [
  { href: "/join/member", label: "Become a Member" },
  { href: "/join/visitor", label: "Visitor" },
];

// Small chevron that rotates when its section is open
function Chevron({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function SiteHeader({ churchName }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [resOpen, setResOpen] = useState(false); // Resources dropdown (desktop)
  const [joinOpen, setJoinOpen] = useState(false); // Join Us dropdown (desktop)
  const [mobileResOpen, setMobileResOpen] = useState(false); // Resources accordion (mobile)
  const [mobileJoinOpen, setMobileJoinOpen] = useState(false); // Join Us accordion (mobile)
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

  // When the whole mobile menu closes, reset the accordion sections too
  function closeMobile() {
    setOpen(false);
    setMobileResOpen(false);
    setMobileJoinOpen(false);
  }

  // Logo click: if already on the homepage, scroll to top instead of doing nothing.
  function handleLogoClick(e) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    closeMobile();
  }

  const linkClass =
    "text-base font-semibold tracking-wide text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors";

  const mobileLinkClass =
    "py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors";

  const mobileSubLinkClass =
    "py-2 pl-6 text-base font-medium text-[var(--color-forest-dark)]/90 hover:text-[var(--color-clay)] transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-gold)] border-b border-[var(--color-forest)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-32">
          {/* Logo (left) */}
          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label={churchName || "Elim House of Worship"}
            className="inline-block"
          >
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
            onClick={() => (open ? closeMobile() : setOpen(true))}
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
            <Link href="/" onClick={closeMobile} className={mobileLinkClass}>
              Home
            </Link>

            {/* Resources accordion */}
            <button
              type="button"
              onClick={() => setMobileResOpen((v) => !v)}
              className="flex items-center justify-between py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
              aria-expanded={mobileResOpen}
            >
              <span>Resources</span>
              <Chevron open={mobileResOpen} />
            </button>
            {mobileResOpen && (
              <div className="flex flex-col">
                {RESOURCES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={mobileSubLinkClass}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/events" onClick={closeMobile} className={mobileLinkClass}>
              Events
            </Link>
            <Link href="/ministries" onClick={closeMobile} className={mobileLinkClass}>
              Ministries
            </Link>
            <Link href="/about" onClick={closeMobile} className={mobileLinkClass}>
              About
            </Link>

            {/* Join Us accordion */}
            <button
              type="button"
              onClick={() => setMobileJoinOpen((v) => !v)}
              className="flex items-center justify-between py-2 text-base font-semibold text-[var(--color-forest-dark)] hover:text-[var(--color-clay)] transition-colors"
              aria-expanded={mobileJoinOpen}
            >
              <span>Join Us</span>
              <Chevron open={mobileJoinOpen} />
            </button>
            {mobileJoinOpen && (
              <div className="flex flex-col">
                {JOIN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={mobileSubLinkClass}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/contact" onClick={closeMobile} className={mobileLinkClass}>
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}