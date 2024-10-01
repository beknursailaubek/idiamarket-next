import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsSearch } from "@/components/ProductsSearch/ProductsSearch";
import { InitialData, FilterOptions } from "@/types";

interface SearchPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
}

async function fetchSearchResults(searchQuery: string, page: number = 1): Promise<InitialData> {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=20`;
  const res = await fetch(url);
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data;
}

async function getFilterOptions(): Promise<FilterOptions> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search/filters`);
  if (!response.ok) {
    console.warn("No filters found for search");
  }

  const options = await response.json();
  return options;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const searchQuery = params.slug?.map(decodeURIComponent).join(" ") || "";
  console.log("Decoded search query:", searchQuery);

  const page = parseInt(searchParams.page || "1", 10);
  console.log("Params.slug:", params.slug);

  const data = await fetchSearchResults(searchQuery, page);
  const filterOptions = await getFilterOptions();

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsSearch initialData={data} filterOptions={filterOptions} title={decodeURI(searchQuery)} searchQuery={searchQuery} />
    </div>
  );
}
