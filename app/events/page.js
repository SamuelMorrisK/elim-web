// app/events/page.js
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getEvents, getStrapiMedia, formatDate, parseLocalDate } from "@/lib/strapi";

export const metadata = { title: "Events" };

// A single event card — reused for both sections
function EventCard({ event }) {
  const img = getStrapiMedia(event.image?.url);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group grid sm:grid-cols-[260px_1fr] gap-6 bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full min-h-[180px] bg-[var(--color-forest)]/10">
        {img && (
          <Image
            src={img}
            alt={event.image?.alternativeText || event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-6 flex flex-col justify-center">
        <p className="eyebrow mb-2">{formatDate(event.date)}</p>
        <h2 className="text-2xl mb-2 group-hover:text-[var(--color-clay)] transition-colors">
          {event.title}
        </h2>
        {event.location && (
          <p className="text-sm text-[var(--color-muted)]">📍 {event.location}</p>
        )}
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const events = await getEvents();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [];
  const past = [];
  for (const event of events || []) {
    const d = parseLocalDate(event.date);
    if (d && d >= today) upcoming.push(event);
    else past.push(event);
  }

  upcoming.sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  past.sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));

  const hasAny = (events || []).length > 0;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Gather With Us" title="Events" />
      <p className="mt-4 text-[var(--color-muted)] max-w-xl">
        Worship nights, fellowship, outreach, and seasonal gatherings - there's a place for you.
      </p>

      {!hasAny && (
        <p className="mt-10 text-[var(--color-muted)]">No events to show right now.</p>
      )}

      {upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl mb-6">Upcoming Events</h2>
          <div className="space-y-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl mb-6 text-[var(--color-forest)]">
            Past Event Highlights
          </h2>
          <div className="space-y-6 opacity-90">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}