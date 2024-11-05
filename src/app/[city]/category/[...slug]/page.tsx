// Страница категории с оптимизацией запросов

import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import { InitialData, FilterOptions } from "@/types";
import { cities } from "@/lib/data";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface CategoryPageProps {
  params: { slug: string[]; city: string };
  searchParams: { [key: string]: string | string[] };
}

async function getProductsByCategory(category_code: string, page: number = 1, minPrice?: string, maxPrice?: string, sort: string = "popular", colors?: string[], attributes?: Record<string, string[]>): Promise<InitialData> {
  let url = `${apiUrl}/categories/${category_code}?page=${page}&limit=20`;

  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  if (sort) url += `&sorting=${encodeURIComponent(sort)}`;

  if (colors && colors.length > 0) {
    colors.forEach((color) => {
      url += `&colors=${encodeURIComponent(color)}`;
    });
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, values]) => {
      values.forEach((value) => {
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      });
    });
  }

  console.log(url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data;
}

async function getFilterOptions(category_code: string): Promise<FilterOptions> {
  const response = await fetch(`${apiUrl}/categories/${category_code}/filters`);
  if (!response.ok) {
    console.warn(`No filters found for category: ${category_code}`);
  }

  const options = await response.json();
  return options;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps) {
  const { city, slug } = params;
  const category_code = slug?.[slug.length - 1] || "";

  const minPrice = Array.isArray(searchParams.minPrice) ? searchParams.minPrice[0] : searchParams.minPrice;
  const maxPrice = Array.isArray(searchParams.maxPrice) ? searchParams.maxPrice[0] : searchParams.maxPrice;
  const sort = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort || "popular";

  // Parse colors
  const colors = Array.isArray(searchParams.colors) ? searchParams.colors : searchParams.colors ? [searchParams.colors] : [];

  // Parse attributes
  const attributes: Record<string, string[]> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!["page", "minPrice", "maxPrice", "sort", "colors"].includes(key)) {
      attributes[key] = Array.isArray(value) ? value : [value];
    }
  });

  const data = await getProductsByCategory(category_code, 1, minPrice, maxPrice, sort, colors, attributes);

  const matchedCity = cities.find((c) => c.uri === city);
  if (!matchedCity) {
    return;
  }

  const cityTitle = matchedCity.title;
  const cityPhone = matchedCity.phone;

  if (!data.category || !data.category.meta_data) {
    return {
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${city}/category/${category_code}`,
      },
    };
  }

  let { meta_title: metaTitle, meta_description: metaDescription } = data.category.meta_data;

  if (metaTitle?.includes("Алматы") && cityTitle) {
    metaTitle = metaTitle.replace(/Алматы/g, cityTitle);
  }

  if (metaDescription) {
    if (metaDescription.includes("по городу Алматы") && cityTitle) {
      metaDescription = metaDescription.replace(/по городу Алматы/g, `по городу ${matchedCity.name}`);
    } else if (metaDescription.includes("Алматы") && cityTitle) {
      metaDescription = metaDescription.replace(/Алматы/g, cityTitle);
    }

    if (metaDescription.includes("8 (702) 993-44-00") && cityPhone) {
      metaDescription = metaDescription.replace(/8 \(702\) 993-44-00/g, cityPhone);
    }
  }

  return {
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${city}/category/${data.category.uri}`,
    },
    title: metaTitle,
    description: metaDescription,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category_code = params.slug[params.slug.length - 1] || "";
  const page = parseInt(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page || "1", 10);

  const minPrice = Array.isArray(searchParams.minPrice) ? searchParams.minPrice[0] : searchParams.minPrice;
  const maxPrice = Array.isArray(searchParams.maxPrice) ? searchParams.maxPrice[0] : searchParams.maxPrice;
  const sort = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort || "popular";
  const colors = Array.isArray(searchParams.colors) ? searchParams.colors : searchParams.colors ? [searchParams.colors] : [];

  const attributes: Record<string, string[]> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!["page", "minPrice", "maxPrice", "sort", "colors"].includes(key)) {
      attributes[key] = Array.isArray(value) ? value : [value];
    }
  });

  const [data, filterOptions] = await Promise.all([getProductsByCategory(category_code, page, minPrice, maxPrice, sort, colors, attributes), getFilterOptions(category_code)]);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} filterOptions={filterOptions} />
    </div>
  );
}
