// app/sermons/[slug]/page.js
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import {
  getSermons,
  getSermonBySlug,
  getStrapiMedia,
  formatDate,
} from "@/lib/strapi";

export async function generateStaticParams() {
  const sermons = await getSermons();
  return sermons.map((sermon) => ({ slug: sermon.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  return { title: sermon?.title || "Sermon" };
}

// Extract the YouTube video ID from any common URL format.
function getYouTubeId(url) {
  if (!url) return null;
  // watch?v=ID, youtu.be/ID, embed/ID, shorts/ID
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /\/embed\/([^?&]+)/,
    /\/shorts\/([^?&]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

export default async function SermonDetailPage({ params }) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

  const img = getStrapiMedia(sermon.thumbnail?.url);
  const videoId = getYouTubeId(sermon.youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/sermons"
        className="text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
      >
        ← All sermons
      </Link>

      <p className="eyebrow mt-8 mb-3">{formatDate(sermon.date)}</p>
      <h1 className="text-4xl sm:text-5xl mb-3">{sermon.title}</h1>
      <p className="text-lg text-[var(--color-clay)] font-medium mb-8">
        {sermon.speaker}
      </p>

      {/* Embedded player if there's a video; otherwise fall back to the thumbnail */}
      {embedUrl ? (
        <div className="relative aspect-video mb-10 rounded-md overflow-hidden bg-[var(--color-forest)]/10">
          <iframe
            src={embedUrl}
            title={sermon.title}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        img && (
          <div className="relative aspect-video mb-10 rounded-md overflow-hidden bg-[var(--color-forest)]/10">
            <Image
              src={img}
              alt={sermon.thumbnail?.alternativeText || sermon.title}
              fill
              className="object-cover"
            />
          </div>
        )
      )}

      {sermon.description && (
        <div className="mb-10 text-lg">
          <RichText content={sermon.description} />
        </div>
      )}
    </main>
  );
}