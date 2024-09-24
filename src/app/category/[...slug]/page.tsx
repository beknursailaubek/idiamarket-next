import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import { Product, Category, Pagination, InitialData } from "@/types";

interface CategoryPageProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string };
  initialData: InitialData;
}

async function getProductsByCategory(category_code: string, page: number = 1): Promise<InitialData> {
  // Возвращаем тип InitialData
  const res = await fetch(`http://localhost:8080/api/categories/${category_code}?page=${page}&limit=20`, { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category_code = params.slug[params.slug.length - 1] || "";
  const page = parseInt(searchParams.page || "1", 10);

  const data = await getProductsByCategory(category_code, page);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} />
    </div>
  );
}
