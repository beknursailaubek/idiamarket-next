import { notFound } from "next/navigation";
import { getProductsByCategory, getFilterOptions } from "@/lib/api";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { InitialData, FilterOptions } from "@/types";

interface CategoryPageProps {
  params: { slug: string[] };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.slug[params.slug.length - 1] || "";
  let data: InitialData;
  let filterOptions: FilterOptions;

  try {
    data = await getProductsByCategory(categorySlug);
    filterOptions = await getFilterOptions(categorySlug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory initialData={data} filterOptions={filterOptions} />
    </div>
  );
}
