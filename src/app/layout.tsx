import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { IntroProvider } from "@/context/IntroContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import CartDrawer from "@/components/CartDrawer";
import { RouteTransitionProvider } from "@/components/motion/RouteTransitionProvider";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* ──────────────────────────────────────────────
 * Global Metadata — serves as the site-wide default.
 * Individual routes override via their own Metadata exports.
 * ────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://sareine.in"),

  title: {
    default: "Sareine",
    template: "%s | Sareine",
  },
  description:
    "Experience the pinnacle of luxury lip care. Sareine — crafted with exotic botanicals for effortlessly soft, nourished lips.",
  keywords: [
    "luxury lip balm",
    "natural lip care",
    "luxury lip treatment",
    "vegan beauty",
    "cruelty-free cosmetics",
    "premium lip treatment",
    "exotic botanicals",
    "Sareine",
  ],
  authors: [{ name: "Sareine", url: "https://sareine.in" }],
  creator: "Sareine",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Sareine",
    description:
      "Discover Sareine — luxury natural lip balms crafted with exotic botanicals for effortlessly soft, nourished lips.",
    url: "/",
    siteName: "Sareine",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/jar-portrait.png",
        width: 1200,
        height: 630,
        alt: "Sareine – Luxury Natural Lip Care",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sareine",
    description:
      "Crafted with exotic botanicals for effortlessly soft, nourished lips.",
    images: ["/jar-portrait.png"],
  },
};

/* Organization JSON-LD — brand identity across the entire site */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sareine",
  url: "https://sareine.in",
  logo: "https://sareine.in/logo-image.png",
  description:
    "Luxury e-commerce brand specializing in natural lip balms crafted with exotic botanicals.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@sareine.in",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <JsonLd data={organizationSchema} />
        <SiteSettingsProvider>
          <AuthProvider>
            <CartProvider>
              <IntroProvider>
                <Suspense fallback={null}>
                  <CartDrawer />
                  <RouteTransitionProvider>
                    <Navbar />
                    {children}
                  </RouteTransitionProvider>
                </Suspense>
              </IntroProvider>
            </CartProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
