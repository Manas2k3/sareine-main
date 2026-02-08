import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { IntroProvider } from "@/context/IntroContext";
import CartDrawer from "@/components/CartDrawer";
import { RouteTransitionProvider } from "@/components/motion/RouteTransitionProvider";
import { Suspense } from "react";

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

export const metadata: Metadata = {
  title: "Sareine | Limited Edition Natural Lip Balm",
  description: "Experience the pinnacle of luxury lip care. Sareine Limited Edition Natural Lip Balm – crafted with exotic botanicals for effortlessly soft, nourished lips.",
  keywords: "luxury lip balm, natural lip care, limited edition, vegan beauty, cruelty-free cosmetics, premium lip treatment, Sareine",
  openGraph: {
    title: "Sareine | Limited Edition Natural Lip Balm",
    description: "Experience the pinnacle of luxury lip care with exotic botanicals.",
    type: "website",
  },
  // Use the project logo placed in /public as the site's favicon
  // Next.js will include these in the <head>. Using a JPG is fine for modern browsers;
  // for broader compatibility you can convert to .ico or provide multiple sizes.
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <AuthProvider>
          <CartProvider>
            <IntroProvider>
              <Suspense fallback={null}>
                <RouteTransitionProvider>
                  <Navbar />
                  <CartDrawer />
                  {children}
                </RouteTransitionProvider>
              </Suspense>
            </IntroProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
