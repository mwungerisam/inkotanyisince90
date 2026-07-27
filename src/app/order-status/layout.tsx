import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Status | INKOTANYI SINCE 90",
  description: "Track your order status",
};

export default function OrderStatusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
