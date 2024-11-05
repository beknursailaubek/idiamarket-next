import styles from "./PopularProducts.module.css";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Product } from "@/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getProductsByType(type: string): Promise<Product[]> {
  const res = await fetch(`${apiUrl}/products/${type}`);
  const products: Product[] = await res.json();

  return products;
}

const PopularProducts = async () => {
  const popularProducts = await getProductsByType("popular");

  return (
    <div className={styles.body}>
      <p className={"title"}>Популярные товары</p>
      <div className={styles.popularProducts}>
        {popularProducts.map((product, index) => (
          <ProductCard type="" product={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
