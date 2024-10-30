import { NextResponse } from "next/server";
import { cities } from "@/lib/data"; // Adjust the path if needed

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Helper function to format dates to `YYYY-MM-DD`
function formatDate(date: Date) {
  return new Date().toISOString().split("T")[0];
}

async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

const staticPages = [
  { url: "", priority: "1.0" },
  { url: "about", priority: "0.6" },
  { url: "contacts", priority: "0.4" },
];

export async function GET() {
  try {
    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
    const today = formatDate(new Date());

    // Function to generate pages for cities with valid URIs
    const generatePagesForCity = (cityUri: string) => [
      ...staticPages.map((page) => ({
        loc: `https://idiamarket.kz/${cityUri}/${page.url}`,
        priority: page.priority,
        lastmod: today,
      })),
      ...products.map((product: { uri: string }) => ({
        loc: `https://idiamarket.kz/${cityUri}/p/${product.uri}`,
        priority: "0.5",
        lastmod: today,
      })),
      ...categories.map((category: { uri: string }) => ({
        loc: `https://idiamarket.kz/${cityUri}/category/${category.uri}`,
        priority: "0.9",
        lastmod: today,
      })),
    ];

    // Generate pages without a city prefix (root URLs)
    const pages = [
      ...staticPages.map((page) => ({
        loc: `https://idiamarket.kz/${page.url}`,
        priority: page.priority,
        lastmod: today,
      })),
      ...products.map((product: { uri: string }) => ({
        loc: `https://idiamarket.kz/p/${product.uri}`,
        priority: "0.5",
        lastmod: today,
      })),
      ...categories.map((category: { uri: string }) => ({
        loc: `https://idiamarket.kz/category/${category.uri}`,
        priority: "0.9",
        lastmod: today,
      })),
    ];

    // Add city-prefixed URLs, only for cities with non-empty `uri`
    cities
      .filter((city) => city.uri) // Exclude cities with empty URIs
      .forEach((city) => {
        pages.push(...generatePagesForCity(city.uri));
      });

    // Generate the sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>${page.loc}</loc>
          <priority>${page.priority}</priority>
          <changefreq>daily</changefreq>
          <lastmod>${page.lastmod}</lastmod>
        </url>`
        )
        .join("")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return new NextResponse("Failed to generate sitemap", { status: 500 });
  }
}
