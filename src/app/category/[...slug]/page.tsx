import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import { InitialData, FilterOptions } from "@/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface CategoryPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
}

async function getProductsByCategory(category_code: string, page: number = 1, minPrice?: string, maxPrice?: string, colors?: string[], sort: string = "popular"): Promise<InitialData> {
  let url = `${apiUrl}/categories/${category_code}?page=${page}&limit=20`;

  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;

  if (colors && colors.length > 0) {
    const colorParams = colors.map((color) => `colors=${encodeURIComponent(color)}`).join("&");
    url += `&${colorParams}`;
  }

  if (sort) {
    url += `&sorting=${encodeURIComponent(sort)}`;
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
  const category_code = params.slug[params.slug.length - 1] || "";
  const data = await getProductsByCategory(category_code, 1);

  if (!data.category || !data.category.meta_data) {
    return {
      title: "IDIA Market – купить торговое оборудование",
      description: "Качественные товары по доступным ценам на idiamarket.kz",
    };
  }

  const metaTitle = data.category.meta_data.meta_title;
  const metaDescription = data.category.meta_data.meta_description;

  return {
    title: metaTitle,
    description: metaDescription,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category_code = params.slug[params.slug.length - 1] || "";
  const page = parseInt(searchParams.page || "1", 10);

  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";

  const colors = searchParams.colors ? searchParams.colors.split(",") : [];

  const sort = searchParams.sort || "popular";

  const data = await getProductsByCategory(category_code, page, minPrice, maxPrice, colors, sort);

  const filterOptions = await getFilterOptions(category_code);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} filterOptions={filterOptions} />
    </div>
  );
}
