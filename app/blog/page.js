// app/blog/page.js
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getBlogs, getStrapiMedia, formatDateShort } from "@/lib/strapi";

export const metadata = { title: "Blogs" };

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeading eyebrow="Words of Faith" title="Blogs" />
      <p className="mt-4 text-[var(--color-muted)] max-w-xl">
        Reflections, teachings, and encouragement - written for our church family.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-[var(--color-muted)]">No posts yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const img = getStrapiMedia(post.coverImage?.url);
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-md overflow-hidden border border-[var(--color-forest)]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[2/1] bg-[var(--color-forest)]/10">
                  {img && (
                    <Image
                      src={img}
                      alt={post.titleEnglish || "Blog post"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="eyebrow mb-2">{formatDateShort(post.date)}</p>
                  <h2 className="text-xl mb-1 leading-snug group-hover:text-[var(--color-clay)] transition-colors">
                    {post.titleEnglish}
                  </h2>
                  {post.titleTelugu && (
                    <p className="text-base text-[var(--color-forest)]/80 font-[family-name:var(--font-display)]">
                      {post.titleTelugu}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}