import { notFound } from "next/navigation";
import styles from "./Search.module.css";
import { ProductsSearch } from "@/components/ProductsSearch/ProductsSearch";

interface Product {
  sku: string;
  title: string;
  images: string[];
  uri: string;
  rating: number;
  price: number;
}

interface SearchPageProps {
  products: Product[];
}

async function fetchProducts(searchQuery: string): Promise<{ products: Product[] }> {
  try {
    console.log("Fetching products with query:", searchQuery);
    const res = await fetch(`http://localhost:8080/api/products/search?query=${searchQuery}`);
    if (!res.ok) {
      notFound();
    }
    const data = await res.json();
    return data;
  } catch (error) {
    notFound();
  }
}

export default async function SearchPage({ params }: { params: { slug: string[] } }) {
  const searchQuery = params.slug?.join(" ") || "";
  console.log("Search query:", searchQuery);

  const products = await fetchProducts(searchQuery);

  return (
    <div className="container">
      <div className={styles.searchPage}>
        <ProductsSearch products={products} title={decodeURI(searchQuery)} />
      </div>
    </div>
  );
}
