// app/page.js
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import {
  getChurch,
  getSermons,
  getEvents,
  getAnnouncements,
  getTodaysPromise,
  getStrapiMedia,
  formatDateShort,
  formatEventDateRange,
  parseLocalDate,
} from "@/lib/strapi";

// Renders service-times text, coloring day-header lines (those ending in ":") in clay.
function ServiceTimes({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="leading-relaxed text-[var(--color-ink)]">
      {lines.map((line, i) => {
        const isDay = line.trim().endsWith(":");
        return (
          <p
            key={i}
            className={
              isDay
                ? "text-[var(--color-clay)] font-semibold mt-3 first:mt-0"
                : ""
            }
          >
            {line || "\u00A0"}
          </p>
        );
      })}
    </div>
  );
}

export default async function HomePage() {
  const [church, sermons, events, announcements, promise] = await Promise.all([
    getChurch(),
    getSermons(),
    getEvents(),
    getAnnouncements(),
    getTodaysPromise(),
  ]);

  const sermon = sermons?.[0] || null;

  // Top 3 events: upcoming first (soonest), then recent past — never blank.
  // Multi-day events stay "upcoming" until their end date passes.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEnd = (e) => parseLocalDate(e.endDate) || parseLocalDate(e.date);
  const upcoming = (events || [])
    .filter((e) => {
      const d = eventEnd(e);
      return d && d >= today;
    })
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  const pastEvents = (events || [])
    .filter((e) => {
      const d = eventEnd(e);
      return d && d < today;
    })
    .sort((a, b) => eventEnd(b) - eventEnd(a));
  const homeEvents = [...upcoming, ...pastEvents].slice(0, 3);

  const recentAnnouncements = (announcements || []).slice(0, 4);
  const heroImage = getStrapiMedia(church?.heroImage?.url);
  const heroImageMobile = getStrapiMedia(church?.heroImageMobile?.url) || heroImage;
  const promiseImage = getStrapiMedia(promise?.image?.url);
  const sermonImg = getStrapiMedia(sermon?.thumbnail?.url);

  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[78vh] flex items-center">
          {heroImage ? (
            <>
              {/* Mobile hero (portrait) — hidden at md and up */}
              <Image
                src={heroImageMobile}
                alt={church?.name || "Elim House of Worship"}
                fill
                priority
                sizes="100vw"
                className="object-cover md:hidden"
              />
              {/* Desktop hero (wide) — hidden below md */}
              <Image
                src={heroImage}
                alt={church?.name || "Elim House of Worship"}
                fill
                priority
                sizes="100vw"
                className="object-cover hidden md:block"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(20,28,22,0.82) 0%, rgba(20,28,22,0.5) 40%, rgba(20,28,22,0.1) 75%, rgba(20,28,22,0) 100%)",
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-[var(--color-forest)]" />
          )}

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 fade-up">
            <p style={{ color: "var(--color-gold)" }} className="eyebrow mb-5">
              Welcome All
            </p>
            <h1
              style={{
                color: "var(--color-cream)",
                textShadow: "0 2px 12px rgba(0,0,0,0.55)",
              }}
              className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl max-w-3xl leading-[1.02]"
            >
              {church?.name || "Elim House of Worship"}
            </h1>
            {church?.nameTelugu && (
              <p
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                className="mt-3 text-2xl sm:text-3xl text-[var(--color-cream)]/90 font-[family-name:var(--font-display)]"
              >
                {church.nameTelugu}
              </p>
            )}
            {church?.tagline && (
              <p
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                className="mt-5 text-lg text-[var(--color-cream)]/85 max-w-xl"
              >
                {church.tagline}
              </p>
            )}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/about"
                style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
                className="inline-block bg-[var(--color-gold)] text-[var(--color-forest-dark)] px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-cream)] transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="inline-block border border-[var(--color-cream)]/60 text-[var(--color-cream)] px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-cream)]/10 transition-colors"
              >
                Plan a Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ---------- TODAY'S PROMISE (lead slot) ---------- */}
        {promiseImage && (
          <section className="py-20">
            <SectionHeading eyebrow="Daily Bread" title="Today's Promise" center />
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[1587/2245] rounded-md overflow-hidden shadow-lg bg-[var(--color-forest)]/10">
                <Image
                  src={promiseImage}
                  alt={promise?.reference || "Today's promise from Elim House of Worship"}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* ---------- SERVICE TIMES (bilingual) ---------- */}
        {(church?.serviceTimesEnglish || church?.serviceTimesTelugu) && (
          <section className="py-20 border-t border-[var(--color-forest)]/10">
            <SectionHeading eyebrow="Join Us" title="Service Times" center />
            <div className="mt-8 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
              {church?.serviceTimesEnglish && (
                <div className="bg-white rounded-md p-6 border border-[var(--color-forest)]/10">
                  <ServiceTimes text={church.serviceTimesEnglish} />
                </div>
              )}
              {church?.serviceTimesTelugu && (
                <div className="bg-white rounded-md p-6 border border-[var(--color-forest)]/10">
                  <ServiceTimes text={church.serviceTimesTelugu} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---------- EVENTS (upcoming first, then recent past) ---------- */}
        <section className="py-20 border-t border-[var(--color-forest)]/10">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeading eyebrow="Gather With Us" title="Explore Our Events" />
            <Link
              href="/events"
              className="text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
            >
              View all events →
            </Link>
          </div>

          {homeEvents.length === 0 ? (
            <p className="mt-8 text-[var(--color-muted)]">
              No events to show right now — check back soon.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeEvents.map((event) => {
                const img =
                  getStrapiMedia(event.cardImage?.url) ||
                  getStrapiMedia(event.image?.url);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group block bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--color-forest)]/10">
                      {img && (
                        <Image
                          src={img}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="eyebrow mb-2">
                        {formatEventDateRange(event.date, event.endDate)}
                      </p>
                      <h3 className="text-xl mb-1 group-hover:text-[var(--color-clay)] transition-colors">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-[var(--color-muted)]">{event.location}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ---------- ANNOUNCEMENTS (only renders when present) ---------- */}
        {recentAnnouncements.length > 0 && (
          <section className="py-20 border-t border-[var(--color-forest)]/10">
            <SectionHeading eyebrow="From the Office" title="Announcements" />
            <div className="mt-8 space-y-4">
              {recentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border-l-4 border-[var(--color-gold)] rounded-r-md p-5 shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="text-xl">{a.title}</h3>
                    {a.publishDate && (
                      <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                        {formatDateShort(a.publishDate)}
                      </span>
                    )}
                  </div>
                  {a.content && (
                    <div className="mt-2 text-[var(--color-ink)] leading-relaxed">
                      {typeof a.content === "string" ? (
                        <p className="whitespace-pre-line">{a.content}</p>
                      ) : (
                        <RichText content={a.content} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- WATCH A MESSAGE (single sermon, pushed down) ---------- */}
        {sermon && (
          <section className="py-20 border-t border-[var(--color-forest)]/10">
            <SectionHeading eyebrow="From the Pulpit" title="Watch a Message" />
            <Link
              href={`/sermons/${sermon.slug}`}
              className="group mt-8 grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="relative aspect-video rounded-md overflow-hidden bg-[var(--color-forest)]/10">
                {sermonImg && (
                  <Image
                    src={sermonImg}
                    alt={sermon.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                )}
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl mb-3 group-hover:text-[var(--color-clay)] transition-colors">
                  {sermon.title}
                </h3>
                <p className="text-[var(--color-clay)] font-medium mb-4">{sermon.speaker}</p>
                <span className="inline-block text-sm font-semibold tracking-wide text-[var(--color-forest)] border-b-2 border-[var(--color-gold)] pb-0.5">
                  Watch &amp; Listen →
                </span>
              </div>
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}