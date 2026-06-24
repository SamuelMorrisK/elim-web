// app/blog/[slug]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogContent from "@/components/BlogContent";
import {
getBlogs,
getBlogBySlug,
getStrapiMedia,
formatDate,
} from "@/lib/strapi";

export async function generateStaticParams() {
const posts = await getBlogs();

return posts.map((post) => ({
slug: post.slug,
}));
}

export async function generateMetadata({ params }) {
const { slug } = await params;
const post = await getBlogBySlug(slug);

return {
title: post?.titleEnglish || "Blog",
};
}

export default async function BlogDetailPage({ params }) {
const { slug } = await params;
const post = await getBlogBySlug(slug);

if (!post) {
notFound();
}

const img = getStrapiMedia(post.coverImage?.url);

const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    post.titleEnglish || ""
  )}`;

return ( <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16"> <Link
     href="/blog"
     className="text-sm font-semibold text-[var(--color-clay)] hover:text-[var(--color-forest)] transition-colors"
   >
← All posts </Link>

  {img && (
    <div className="relative aspect-[2/1] mt-8 mb-6 rounded-md overflow-hidden bg-[var(--color-forest)]/10">
      <Image
        src={img}
        alt={post.titleEnglish || "Blog post"}
        fill
        priority
        className="object-cover"
      />
    </div>
  )}

  <div className="flex items-center justify-between flex-wrap gap-3 mb-8 text-sm text-[var(--color-muted)]">
    <span>
      {formatDate(post.date)}
      {post.author && <span> · {post.author}</span>}
    </span>

    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:opacity-80 transition-opacity"
    >
      Share on WhatsApp
    </a>
  </div>

  <BlogContent post={post} />
</main>
);
}

      