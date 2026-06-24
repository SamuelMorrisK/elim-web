// components/JoinPageContent.jsx
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";

export default function JoinPageContent({
  eyebrow = "Join Us",
  heading,
  image,
  introEnglish,
  introTelugu,
  formUrl,
  buttonLabel,
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow={eyebrow} title={heading} />

      {/* Image left, text right */}
      <div className="mt-1 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[3/2] rounded-md overflow-hidden bg-[var(--color-forest)]/10 shadow-sm">
          {image && (
            <Image
              src={image}
              alt={heading}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>

        <div>
          {introEnglish && (
            <div className="text-lg text-[var(--color-ink)] mb-5">
              <RichText content={introEnglish} />
            </div>
          )}
          {introTelugu && (
            <div className="text-base text-[var(--color-muted)] mb-8">
              <RichText content={introTelugu} />
            </div>
          )}

          {formUrl && (
            <Link
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-forest-dark)] px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-[var(--color-cream)] border border-[var(--color-gold)] transition-colors shadow-md"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}