// app/sermons/page.js
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getSermons, getStrapiMedia, formatDateShort } from "@/lib/strapi";

export const metadata = { title: "Sermons" };

export default async function SermonsPage() {
  const sermons = await getSermons();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Teaching & Word" title="Sermons" />
      <p className="mt-4 text-[var(--color-muted)] max-w-xl">
        Messages from our pastors to encourage, challenge, and draw us closer to God.
      </p>

      {sermons.length === 0 ? (
        <p className="mt-10 text-[var(--color-muted)]">No sermons have been posted yet.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => {
            const img = getStrapiMedia(sermon.thumbnail?.url);
            return (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.slug}`}
                className="group block bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video bg-[var(--color-forest)]/10">
                  {img && (
                    <Image
                      src={img}
                      alt={sermon.thumbnail?.alternativeText || sermon.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="eyebrow mb-2">{formatDateShort(sermon.date)}</p>
                  <h2 className="text-xl mb-1 group-hover:text-[var(--color-clay)] transition-colors">
                    {sermon.title}
                  </h2>
                  <p className="text-sm text-[var(--color-clay)] font-medium">
                    {sermon.speaker}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}