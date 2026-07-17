// app/layout.js
import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_Telugu,
  Anek_Telugu,
} from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import { getChurch } from "@/lib/strapi";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-telugu",
  display: "swap",
});

const anekTelugu = Anek_Telugu({
  subsets: ["telugu"],
  weight: ["500", "600", "700"],
  variable: "--font-anek-telugu",
  display: "swap",
});

// Structured location facts for JSON-LD (kept explicit for accuracy/consistency)
const CHURCH_GEO = { lat: 16.427609374258676, lng: 80.99459619551205 };
const CHURCH_ADDRESS = {
  streetAddress: "D.No. 17/274, Slater Peta",
  addressLocality: "Gudivada",
  addressRegion: "Andhra Pradesh",
  postalCode: "521301",
  addressCountry: "IN",
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://weareelim.in"
  ),
  title: {
    default: "Elim House Of Worship",
    template: "%s | Elim House Of Worship",
  },
  description:
    "Elim House Of Worship is a Christ-centered church in Gudivada, Andhra Pradesh — worship, prayer, discipleship, and community.",
};

export default async function RootLayout({ children }) {
  let church = null;
  try {
    church = await getChurch();
  } catch (e) {
    // If Strapi is unreachable at build time, fall back to defaults.
    church = null;
  }
  const churchName = church?.name || "Elim House Of Worship";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://weareelim.in";
  const logoUrl = `${siteUrl}/pic1.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: churchName,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    telephone: "+917396176999",
    email: "office@weareelim.in",
    address: {
      "@type": "PostalAddress",
      ...CHURCH_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CHURCH_GEO.lat,
      longitude: CHURCH_GEO.lng,
    },
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${notoTelugu.variable} ${anekTelugu.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader churchName={churchName} />
        <div className="flex-1">{children}</div>
        <SiteFooter church={church} />
        <BackToTop />
      </body>
    </html>
  );
}