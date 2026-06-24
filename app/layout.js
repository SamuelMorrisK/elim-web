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

export const metadata = {
  title: {
    default: "Elim House Of Worship",
    template: "%s | Elim House Of Worship",
  },
  description: "A welcoming place of faith.",
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

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${notoTelugu.variable} ${anekTelugu.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <SiteHeader churchName={churchName} />
        <div className="flex-1">{children}</div>
        <SiteFooter church={church} />
        <BackToTop />
      </body>
    </html>
  );
}