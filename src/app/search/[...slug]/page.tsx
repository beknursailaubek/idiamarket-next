import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsSearch } from "@/components/ProductsSearch/ProductsSearch";
import { InitialData, FilterOptions } from "@/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface SearchPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
}

async function fetchSearchResults(searchQuery: string, page: number = 1, minPrice?: string, maxPrice?: string, colors?: string[], sort: string = "popular"): Promise<InitialData> {
  let url = `${apiUrl}/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=20`;

  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;

  if (colors && colors.length > 0) {
    const colorParams = colors.map((color) => `colors=${encodeURIComponent(color)}`).join("&");
    url += `&${colorParams}`;
  }

  if (sort) {
    url += `&sorting=${encodeURIComponent(sort)}`;
  }

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  console.log(data);
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

  const page = parseInt(searchParams.page || "1", 10);

  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";

  const colors = searchParams.colors ? searchParams.colors.split(",") : [];

  const sort = searchParams.sort || "popular";

  const data = await fetchSearchResults(searchQuery, page, minPrice, maxPrice, colors, sort);

  const filterOptions = await getFilterOptions(searchQuery);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsSearch initialData={data} filterOptions={filterOptions} title={decodeURI(searchQuery)} searchQuery={searchQuery} />
    </div>
  );
}
