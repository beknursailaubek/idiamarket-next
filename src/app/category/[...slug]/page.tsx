import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import { InitialData, FilterOptions } from "@/types";

interface CategoryPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
}

async function getProductsByCategory(category_code: string, page: number = 1, minPrice?: string, maxPrice?: string, colors?: string[]): Promise<InitialData> {
  let url = `http://localhost:8080/api/categories/${category_code}?page=${page}&limit=20`;

  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;

  if (colors && colors.length > 0) {
    const colorParams = colors.map((color) => `colors=${encodeURIComponent(color)}`).join("&");
    url += `&${colorParams}`;
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
  const response = await fetch(`http://localhost:8080/api/categories/${category_code}/filters`);
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
    console.warn("Category data or meta_data is missing:", data);
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

  const data = await getProductsByCategory(category_code, page, minPrice, maxPrice, colors);

  const filterOptions = await getFilterOptions(category_code);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} filterOptions={filterOptions} />
    </div>
  );
}
