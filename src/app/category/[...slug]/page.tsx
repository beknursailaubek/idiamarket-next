import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Category.module.css";
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
      <div className={styles.categoryPage}>
        <Filter />

        <div className={styles.categoryPageBody}>
          {category.children && category.children.length > 0 ? (
            <>
              <div className={styles.categoryPageInfo}>
                <h1 className={`title ${styles.categoryPageTitle}`}>{category.title}</h1>
              </div>
              <div className={styles.categoryPageRedirects}>
                {category.children.map((redirect) => (
                  <Link href={`/category/${redirect.uri}`} className={styles.categoryPageRedirect} key={redirect.uri}>
                    {redirect.image ? <Image className={styles.redirectImage} src={redirect.image} alt={redirect.title} width={200} height={200} /> : null}
                    {redirect.title}
                  </Link>
                ))}
              </div>

              <div className={styles.categoryPageHeader}>
                <span className={styles.categoryPageCount}>
                  {products.length === 1 ? "Найден" : "Найдено"} {products.length} {getProductWord(products.length)}
                </span>
                <div className="flex gap-[20px]">
                  <Sort />
                  <CardViews />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.pageHeader}>
                <div className={styles.categoryPageInfo}>
                  <h1 className={`title ${styles.pageTitle}`}>{category.title}</h1>
                  <span className={styles.categoryPageCount}>
                    {products.length === 1 ? "Найден" : "Найдено"} {products.length} {getProductWord(products.length)}
                  </span>
                </div>

                <div className="flex gap-[20px]">
                  <Sort />
                  <CardViews />
                </div>
              </div>
            </>
          )}

          <div>
            {products && products.length > 0 ? (
              <div className={styles.categoryPageProducts}>
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
