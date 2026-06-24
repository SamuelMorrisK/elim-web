// app/events/[slug]/page.js
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import {
  getEvents,
  getEventBySlug,
  getFirstMediaUrl,
  formatDate,
} from "@/lib/strapi";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event?.title || "Event" };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const img = getFirstMediaUrl(event.image);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/events"
        className="text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
      >
        ← All events
      </Link>

      <p className="eyebrow mt-8 mb-3">{formatDate(event.date)}</p>
      <h1 className="text-4xl sm:text-5xl mb-3">{event.title}</h1>
      {event.location && (
        <p className="text-lg text-[var(--color-clay)] font-medium mb-8">
          📍 {event.location}
        </p>
      )}

      {img && (
        <div className="relative aspect-video mb-10 rounded-md overflow-hidden bg-[var(--color-forest)]/10">
          <Image
            src={img}
            alt={event.image?.[0]?.alternativeText || event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {event.description && (
        <div className="text-lg">
          <RichText content={event.description} />
        </div>
      )}
    </main>
  );
}
