// app/sitemap.js
import { getSermons, getEvents, getBlogs } from "@/lib/strapi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weareelim.in";

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/events",
    "/ministries",
    "/sermons",
    "/blog",
    "/contact",
    "/join/member",
    "/join/visitor",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Dynamic routes from Strapi — fail-safe so a fetch error doesn't break the build
  let sermons = [];
  let events = [];
  let blogs = [];
  try {
    [sermons, events, blogs] = await Promise.all([
      getSermons(),
      getEvents(),
      getBlogs(),
    ]);
  } catch {
    // If Strapi is unreachable at build, ship the static routes only.
  }

  const sermonRoutes = (sermons || []).map((s) => ({
    url: `${SITE_URL}/sermons/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const eventRoutes = (events || []).map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes = (blogs || []).map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...sermonRoutes, ...eventRoutes, ...blogRoutes];
}