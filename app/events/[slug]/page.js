// app/events/[slug]/page.js
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import Gallery from "@/components/Gallery";
import ShareButton from "@/components/ShareButton";
import {
  getEvents,
  getEventBySlug,
  getChurch,
  getStrapiMedia,
  formatEventDateRange,
  formatTimeRange,
} from "@/lib/strapi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weareelim.in";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event" };

  const ogImage = getStrapiMedia(event.image?.url);

  return {
    title: event.title || "Event",
    openGraph: {
      title: event.title || "Event",
      url: `${SITE_URL}/events/${event.slug}`,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

// Small inline icons (monochrome, inherit text color)
function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 shrink-0 text-[var(--color-clay)]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 shrink-0 text-[var(--color-clay)]"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const [event, church] = await Promise.all([getEventBySlug(slug), getChurch()]);

  if (!event) notFound();

  const img = getStrapiMedia(event.image?.url);
  const imgW = event.image?.width || 1200;
  const imgH = event.image?.height || 1600;
  const dateLabel = formatEventDateRange(event.date, event.endDate);
  const timeLabel = formatTimeRange(event.startTime, event.endTime);
  const directionsUrl = event.locationMapUrl || church?.maplink || null;
  const gallery = Array.isArray(event.gallery) ? event.gallery : [];
  const eventUrl = `${SITE_URL}/events/${event.slug}`;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/events"
        className="text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
      >
        ← All events
      </Link>

      {/* Details — left aligned */}
      <div className="mt-8">
        <p className="eyebrow mb-3 -ml-[0.1em]">{dateLabel}</p>
        <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-6">{event.title}</h1>

        <dl className="flex flex-col gap-3">
          {timeLabel && (
            <div className="flex items-center gap-3">
              <dt className="sr-only">Time</dt>
              <ClockIcon />
              <dd className="text-[var(--color-ink)]">{timeLabel}</dd>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-3">
              <dt className="sr-only">Location</dt>
              <PinIcon />
              <dd className="text-[var(--color-ink)]">{event.location}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Poster — centered, capped width, natural ratio on a soft frame */}
      {img && (
        <div className="mt-8 flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg bg-[var(--color-forest)]/5 border border-[var(--color-forest)]/10 max-w-md">
            <Image
              src={img}
              alt={event.image?.alternativeText || event.title}
              width={imgW}
              height={imgH}
              priority
              sizes="(max-width: 768px) 100vw, 448px"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Actions — directions + share */}
     <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
  {directionsUrl && (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-forest-dark)] px-5 py-2.5 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-cream)] transition-colors"
    >
      Get Directions
    </a>
  )}
  <ShareButton url={eventUrl} title={event.title} />
</div>

{/* Description */}
{event.description && (
  <div className="mt-12 text-lg body-prose">
    <RichText content={event.description} />
  </div>
)}

{/* Gallery — only when photos exist */}
{gallery.length > 0 && (
  <section className="mt-12 pt-10 border-t border-[var(--color-forest)]/10">
    <p className="eyebrow mb-5">Highlights</p>
    <Gallery images={gallery} title={event.title} />
  </section>
)}
</main>
);
}