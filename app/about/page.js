// app/about/page.js
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import { getChurch, getLeaders, getStrapiMedia } from "@/lib/strapi";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [church, leaders] = await Promise.all([getChurch(), getLeaders()]);
  const heroImage = getStrapiMedia(church?.heroImage?.url);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Our Story" title={`About ${church?.name || "Us"}`} />
      {church?.nameTelugu && (
        <p className="mt-2 text-2xl font-[family-name:var(--font-display)] text-[var(--color-clay)]">
          {church.nameTelugu}
        </p>
      )}
      {church?.regdNumber && (
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Regd. No. {church.regdNumber}
        </p>
      )}

      {heroImage && (
        <div className="relative aspect-[21/9] mt-8 mb-10 rounded-md overflow-hidden bg-[var(--color-forest)]/10">
          <Image
            src={heroImage}
            alt={church?.heroImage?.alternativeText || church?.name || "Church"}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Story */}
      {church?.aboutUs && (
        <div className="text-lg max-w-2xl mx-auto text-center">
          <RichText content={church.aboutUs} />
        </div>
      )}

      {/* Leadership */}
      {leaders && leaders.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[var(--color-forest)]/10">
          <SectionHeading eyebrow="Those Who Serve" title="Our Leadership" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {leaders.map((leader) => {
              const photo = getStrapiMedia(leader.photo?.url);
              return (
                <div
                  key={leader.id}
                  className="bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10"
                >
                  {photo && (
                    <div className="relative aspect-[4/5] bg-[var(--color-forest)]/10">
                      <Image
                        src={photo}
                        alt={leader.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl mb-1">{leader.name}</h3>
                    {leader.role && (
                      <p className="text-sm text-[var(--color-clay)] font-medium">
                        {leader.role}
                      </p>
                    )}
                    {leader.qualifications && (
                      <p className="text-sm text-[var(--color-muted)] mt-0.5">
                        {leader.qualifications}
                      </p>
                    )}
                    {leader.bio && (
                      <p className="mt-4 text-[var(--color-ink)] leading-relaxed whitespace-pre-line">
                        {leader.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick facts */}
      <section className="mt-16 pt-12 border-t border-[var(--color-forest)]/10 grid gap-8 sm:grid-cols-2">
        {(church?.serviceTimesEnglish || church?.serviceTimesTelugu) && (
          <div>
            <p className="eyebrow mb-2">Service Times</p>
            {church?.serviceTimesEnglish && (
              <p className="whitespace-pre-line text-[var(--color-ink)] mb-3">
                {church.serviceTimesEnglish}
              </p>
            )}
            {church?.serviceTimesTelugu && (
              <p className="whitespace-pre-line text-[var(--color-muted)]">
                {church.serviceTimesTelugu}
              </p>
            )}
          </div>
        )}
        {(church?.addressEnglish || church?.addressTelugu) && (
          <div>
            <p className="eyebrow mb-2">Where to Find Us</p>
            {church?.addressEnglish && (
              <p className="whitespace-pre-line text-[var(--color-ink)] mb-3">
                {church.addressEnglish}
              </p>
            )}
            {church?.addressTelugu && (
              <p className="whitespace-pre-line text-[var(--color-muted)]">
                {church.addressTelugu}
              </p>
            )}

            {/* Map — sits below the address, in the right column */}
            {church?.mapEmbedUrl && (
              <div className="mt-6">
                <div className="rounded-md overflow-hidden border border-[var(--color-forest)]/10 shadow-sm">
                  <iframe
                    src={church.mapEmbedUrl}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Church location map"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}