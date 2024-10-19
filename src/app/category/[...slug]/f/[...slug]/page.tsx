import { notFound } from "next/navigation";
import { getProductsByFilters, getFilterOptions } from "@/lib/api";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { InitialData, FilterOptions } from "@/types";

interface FilteredPageProps {
  params: { slug: string[] };
}

const parseFiltersFromSlug = (slug: string[]) => {
  let filters: { [key: string]: string[] } = {};

  for (let i = 0; i < slug.length; i += 2) {
    const key = slug[i];
    const value = slug[i + 1]?.split(",") || [];
    filters[key] = value;
  }

  return filters;
};

export default async function FilteredPage({ params }: FilteredPageProps) {
  const filters = parseFiltersFromSlug(params.slug);
  let data: InitialData;
  let filterOptions: FilterOptions;

  try {
    data = await getProductsByFilters(filters);
    filterOptions = await getFilterOptions();
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
