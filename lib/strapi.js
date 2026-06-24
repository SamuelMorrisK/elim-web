// lib/strapi.js
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Turn Strapi's relative media path into a full URL.
// Returns null if there's no image, so callers can guard easily.
export function getStrapiMedia(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

// Pull the first media item's URL from a (possibly null) MULTIPLE-media array.
// Use this for fields set to "multiple media" (e.g. Sermon.thumbnail, Event.image).
export function getFirstMediaUrl(media) {
  if (!Array.isArray(media) || media.length === 0) return null;
  return getStrapiMedia(media[0].url);
}

// Core fetch helper. Adds the base URL, parses JSON, sets ISR revalidate.
async function fetchAPI(path) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    next: { revalidate: 60 }, // ISR: rebuild at most once a minute
  });
  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${path}`);
  }
  const json = await res.json();
  return json.data;
}

// --- Sermons ---
export async function getSermons() {
  return fetchAPI("/sermons?populate=*&sort=date:desc");
}

export async function getSermonBySlug(slug) {
  const data = await fetchAPI(`/sermons?filters[slug][$eq]=${slug}&populate=*`);
  return data?.[0] || null;
}

// --- Events ---
export async function getEvents() {
  return fetchAPI("/events?populate=*&sort=date:asc");
}

export async function getEventBySlug(slug) {
  const data = await fetchAPI(`/events?filters[slug][$eq]=${slug}&populate=*`);
  return data?.[0] || null;
}

// --- Announcements ---
export async function getAnnouncements() {
  return fetchAPI("/announcements?populate=*&sort=publishDate:desc");
}

// --- Ministries ---
export async function getMinistries() {
  return fetchAPI("/ministries?populate=*");
}

// --- Promises (daily poster) ---
export async function getPromises() {
  return fetchAPI("/promises?populate=*&sort=date:desc");
}

// Most recent promise dated on or before today; falls back to newest available.
export async function getTodaysPromise() {
  const promises = await getPromises();
  if (!promises || promises.length === 0) return null;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const current = promises.find((p) => {
    const d = parseLocalDate(p.date);
    return d && d <= today;
  });
  return current || promises[0];
}

// --- Leaders ---
export async function getLeaders() {
  return fetchAPI("/leaders?populate=*&sort=order:asc");
}

// --- Church (single type) ---
export async function getChurch() {
  return fetchAPI("/church?populate=*");
}

// --- Blog ---
export async function getBlogs() {
  return fetchAPI("/blogs?populate=*&sort=date:desc");
}

export async function getBlogBySlug(slug) {
  const data = await fetchAPI(`/blogs?filters[slug][$eq]=${slug}&populate=*`);
  return data?.[0] || null;
}

// Build a tap-to-WhatsApp link from a digits-only number (e.g. "917396176999").
export function whatsappLink(number, message) {
  if (!number) return null;
  const clean = String(number).replace(/[^0-9]/g, "");
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}


export function parseLocalDate(value) {
  if (!value) return null;
  const datePart = String(value).split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) {
    const fallback = new Date(value);
    return isNaN(fallback) ? null : fallback;
  }
  return new Date(year, month - 1, day); 
}

// Format an ISO date string into a readable long date.
export function formatDate(value) {
  if (!value) return "";
  const d = parseLocalDate(value);
  if (!d) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Shorter date for cards.
export function formatDateShort(value) {
  if (!value) return "";
  const d = parseLocalDate(value);
  if (!d) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}