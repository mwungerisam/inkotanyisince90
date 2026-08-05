import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNSMPI | INKOTANYISINCE90",
  description: "Do Not Sell or Share My Personal Information",
};

export default function DNSMPILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Route layouts must NOT render another <html>/<body> or remount providers
  // already supplied by the root layout. Return children only.
  return children;
}
