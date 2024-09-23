import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Search.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";

const getProductWord = (count: number): string => {
  switch (true) {
    case count % 10 === 1 && count % 100 !== 11:
      return "товар";
    case [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100):
      return "товара";
    default:
      return "товаров";
  }
};

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
        <Filter />

        <div className={styles.searchPageBody}>
          <div className={styles.searchPageHeader}>
            <div className={styles.searchPageInfo}>
              <h1 className={`title ${styles.searchPageTitle}`}>Результаты поиска: {decodeURI(searchQuery)}</h1>
              <span className={styles.searchPageCount}>
                {products?.length === 1 ? "Найден" : "Найдено"} {products?.length} {getProductWord(products?.length)}
              </span>
            </div>
            <div className="flex gap-[20px]">
              <Sort />
              <CardViews />
            </div>
          </div>

          <div>
            {products && products.length > 0 ? (
              <div className={styles.searchPageProducts}>
                {products.map((product) => (
                  <ProductCard type="" key={product.sku} product={product} />
                ))}
              </div>
            ) : (
              <div>Не найдено</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
