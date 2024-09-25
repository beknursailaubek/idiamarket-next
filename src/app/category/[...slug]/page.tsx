import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import { Product, Category, Pagination, InitialData } from "@/types";

interface CategoryPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
  initialData: InitialData;
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category_code = params.slug[params.slug.length - 1] || "";
  const page = parseInt(searchParams.page || "1", 10);

  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";

  const colors = searchParams.colors ? searchParams.colors.split(",") : [];

  const data = await getProductsByCategory(category_code, page, minPrice, maxPrice, colors);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} />
    </div>
  );
}
