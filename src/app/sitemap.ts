import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/new",
    "/mens",
    "/womens",
    "/accessories",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
    "/cookies",
    "/order-status",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
