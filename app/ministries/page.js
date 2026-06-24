// app/ministries/page.js
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import { getMinistries, getFirstMediaUrl } from "@/lib/strapi";

export const metadata = { title: "Ministries" };

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Get Involved" title="Ministries" />
      <p className="mt-4 text-[var(--color-muted)] max-w-xl">
        However God has gifted you, there's a way to serve and grow alongside others.
      </p>

      {ministries.length === 0 ? (
        <p className="mt-10 text-[var(--color-muted)]">Ministry details are coming soon.</p>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {ministries.map((m) => {
            const img = getFirstMediaUrl(m.image);
            return (
              <div
                key={m.id}
                className="bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10 flex flex-col"
              >
                {img && (
                  <div className="relative aspect-[16/9] bg-[var(--color-forest)]/10">
                    <Image
                      src={img}
                      alt={m.image?.[0]?.alternativeText || m.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl mb-1">{m.name}</h2>
                  {m.leader && (
                    <p className="text-sm text-[var(--color-clay)] font-medium mb-3">
                      Led by {m.leader}
                    </p>
                  )}
                  {m.description && (
                    <div className="text-[var(--color-ink)]">
                      <RichText content={m.description} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
