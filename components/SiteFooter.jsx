// components/SiteFooter.jsx
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";

export default function SiteFooter({ church }) {
  const year = new Date().getFullYear();
  const name = church?.name || "Elim House of Worship";
  const footerImage = getStrapiMedia(church?.footerImage?.url);

  return (
    <footer className="bg-[var(--color-forest-dark)] text-[var(--color-cream)] mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-[auto_1.6fr_1.1fr_0.9fr] md:items-start md:gap-x-14">
          {/* Column 1 — Photo */}
          {footerImage && (
            <div className="flex justify-center md:justify-start">
              <div className="relative w-56 h-40 rounded-lg overflow-hidden ring-2 ring-[var(--color-gold)]/70 ring-offset-4 ring-offset-[var(--color-forest-dark)]">
                <Image
                  src={footerImage}
                  alt={church?.footerImage?.alternativeText || name}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}

          {/* Column 2 — Identity */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-4xl font-semibold !text-[var(--color-clay)] whitespace-nowrap">
              {name}
            </h3>
            {church?.nameTelugu && (
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-cream)] mt-1">
                {church.nameTelugu}
              </p>
            )}
            {church?.tagline && (
              <p className="text-sm text-[var(--color-cream)]/70 mt-3 max-w-xs leading-relaxed">
                {church.tagline}
              </p>
            )}
            {church?.regdNumber && (
              <p className="text-xs text-[var(--color-cream)]/50 mt-3">
                Regd. No. {church.regdNumber}
              </p>
            )}
          </div>

          {/* Column 3 — Visit Us */}
          <div>
            <p className="eyebrow text-[var(--color-gold)] mb-4">Visit Us</p>
            {church?.addressEnglish && (
              <p className="text-sm text-[var(--color-cream)]/75 whitespace-pre-line leading-relaxed mb-3">
                {church.addressEnglish}
              </p>
            )}
            {church?.maplink && (
              <Link
                href={church.maplink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-cream)] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Open in Google Maps
              </Link>
            )}
          </div>

          {/* Column 4 — Explore */}
          <div>
            <p className="eyebrow text-[var(--color-gold)] mb-4">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">Home</Link></li>
              <li><Link href="/sermons" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">Sermons</Link></li>
              <li><Link href="/events" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">Events</Link></li>
              <li><Link href="/ministries" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">Ministries</Link></li>
              <li><Link href="/about" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-[var(--color-cream)]/70 hover:text-[var(--color-gold)] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-cream)]/15 text-xs text-[var(--color-cream)]/50">
          © {year} {name}. All are welcome.
        </div>
      </div>
    </footer>
  );
}