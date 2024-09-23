import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { ProductsCategory } from "@/components/ProductsCategory/ProductsCategory";

interface Product {
  sku: string;
  title: string;
  images: string[];
  uri: string;
  rating: number;
  price: number;
}

interface Category {
  title: string;
  children?: Array<{ uri: string; image?: string; title: string }>;
}

interface CategoryPageProps {
  products: Product[];
  category: Category;
}

async function getProductsByCategory(category_code: string): Promise<{ products: Product[]; category: Category }> {
  const res = await fetch(`http://localhost:8080/api/categories/${category_code}`);

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data;
}

// This is now an async server component
export default async function CategoryPage({ params }: { params: { slug: string[] } }) {
  const category_code = params.slug[params.slug.length - 1] || "";
  const { products, category } = await getProductsByCategory(category_code);

  return (
    <div className="container">
      <Breadcrumbs />
      <ProductsCategory products={products} category={category} />
    </div>
  );
}
