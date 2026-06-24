// app/contact/page.js
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { getChurch, whatsappLink } from "@/lib/strapi";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const church = await getChurch();
  const wa = whatsappLink(
    church?.whatsapp,
    "Hello! I found Elim House of Worship online and would like to know more."
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Reach Out" title="Contact Us" />
      <p className="mt-4 text-[var(--color-muted)] max-w-xl">
        Questions, prayer requests, or planning your first visit - we'd love to hear from you.
      </p>
      
      {/* Primary contact actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        {/* {wa && (
          <Link
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Message us on WhatsApp
          </Link>
        )} */}
        {/*
        {church?.phone && (
          <Link
            href={`tel:${String(church.phone).replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-2 border border-[var(--color-forest)]/30 text-[var(--color-forest)] px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-forest)]/5 transition-colors"
          >
            Call Us
          </Link>
        )}
        */}
        {/* {church?.email && (
          <Link
            href={`mailto:${church.email}`}
            className="inline-flex items-center gap-2 border border-[var(--color-forest)]/30 text-[var(--color-forest)] px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-forest)]/5 transition-colors"
          >
            Email Us
          </Link>
        )} */}
      </div> 

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_340px]">
        <div>
          <ContactForm />
        </div>

        <aside className="space-y-8">
          {(church?.addressEnglish || church?.addressTelugu) && (
            <div>
              <p className="eyebrow mb-2">Visit Us</p>
              {church?.addressEnglish && (
                <p className="whitespace-pre-line text-[var(--color-ink)] leading-relaxed mb-3">
                  {church.addressEnglish}
                </p>
              )}
              {church?.addressTelugu && (
                <p className="whitespace-pre-line text-[var(--color-muted)] leading-relaxed">
                  {church.addressTelugu}
                </p>
              )}
              {church?.maplink && (
                <Link
                  href={church.maplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
                >
                  Open in Google Maps →
                </Link>
              )}
            </div>
          )}

          {(church?.serviceTimesEnglish || church?.serviceTimesTelugu) && (
            <div>
              <p className="eyebrow mb-2">Service Times</p>
              {church?.serviceTimesEnglish && (
                <p className="whitespace-pre-line text-[var(--color-ink)] leading-relaxed mb-3">
                  {church.serviceTimesEnglish}
                </p>
              )}
              {church?.serviceTimesTelugu && (
                <p className="whitespace-pre-line text-[var(--color-muted)] leading-relaxed">
                  {church.serviceTimesTelugu}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
