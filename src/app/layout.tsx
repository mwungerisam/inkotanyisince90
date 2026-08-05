import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { CartProvider } from "@/context/CartContext";
import { ProductViewProvider } from "@/context/ProductViewContext";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import CartDrawer from "@/components/CartDrawer";
import CartToast from "@/components/CartToast";
import CookieBanner from "@/components/CookieBanner";

config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "INKOTANYISINCE90 | Premium Streetwear",
    template: "%s | INKOTANYISINCE90",
  },
  description:
    "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
  keywords: [
    "streetwear",
    "fashion",
    "Rwanda",
    "minimalist",
    "luxury",
    "clothing",
  ],
  openGraph: {
    type: "website",
    siteName: "INKOTANYISINCE90",
    title: "INKOTANYISINCE90 | Premium Streetwear",
    description:
      "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "INKOTANYISINCE90 | Premium Streetwear",
    description:
      "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{ fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif' }}
    >
<body className="min-h-full flex flex-col">
        <ProductViewProvider>
          <CartProvider>
            <ConditionalHeader />
            {children}
            <ConditionalFooter />
            <CartDrawer />
            <CartToast />
            <CookieBanner />
          </CartProvider>
        </ProductViewProvider>
      </body>
    </html>
  );
}
