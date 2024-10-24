import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsSearch } from "@/components/ProductsSearch/ProductsSearch";
import { InitialData, FilterOptions } from "@/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface SearchPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] };
}

async function fetchSearchResults(searchQuery: string, page: number = 1, minPrice?: string, maxPrice?: string, sort: string = "popular", colors?: string[], attributes?: Record<string, string[]>): Promise<InitialData> {
  let url = `${apiUrl}/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=20`;

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

async function getFilterOptions(searchQuery: string): Promise<FilterOptions> {
  const response = await fetch(`${apiUrl}/products/search/filters?query=${encodeURIComponent(searchQuery)}`);

  if (!response.ok) {
    console.warn("No filters found for search");
  }

  const options = await response.json();
  return options;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const searchQuery = params.slug?.map(decodeURIComponent).join(" ") || "";

  const page = parseInt(typeof searchParams.page === "string" ? searchParams.page : searchParams.page?.[0] || "1", 10);

  const minPrice = typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined;

  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "popular";

  const colors = Array.isArray(searchParams.colors) ? searchParams.colors : searchParams.colors ? [searchParams.colors] : [];

  const attributes: Record<string, string[]> = {};

  // Предполагается, что все ключи, кроме 'page', 'minPrice', 'maxPrice', 'sort', 'colors' являются атрибутами
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!["page", "minPrice", "maxPrice", "sort", "colors"].includes(key)) {
      if (Array.isArray(value)) {
        attributes[key] = value;
      } else {
        attributes[key] = [value];
      }
    }
  });

  const data = await fetchSearchResults(searchQuery, page, minPrice, maxPrice, sort, colors, attributes);

  const filterOptions = await getFilterOptions(searchQuery);

  return (
    <div className="container">
      <Breadcrumbs page="search" />
      <ProductsSearch initialData={data} filterOptions={filterOptions} title={decodeURI(searchQuery)} searchQuery={searchQuery} />
    </div>
  );
}
