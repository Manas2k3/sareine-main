import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { IntroProvider } from "@/context/IntroContext";
import CartDrawer from "@/components/CartDrawer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <AuthProvider>
          <CartProvider>
            <IntroProvider>
              <Navbar />
              <CartDrawer />
              {children}
            </IntroProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
