import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { CartProvider } from "@/context/CartContext";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import CartDrawer from "@/components/CartDrawer";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "INKOTANYI SINCE 90 | Premium Streetwear",
  description: "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
  keywords: ["streetwear", "fashion", "Rwanda", "minimalist", "luxury", "clothing"],
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
        <CartProvider>
          <ConditionalHeader />
          {children}
          <ConditionalFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
