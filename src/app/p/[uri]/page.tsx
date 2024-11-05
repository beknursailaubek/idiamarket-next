import { notFound } from "next/navigation";
import styles from "./Product.module.css";
import ProductAttributes from "@/components/ProductAttributes/ProductAttributes";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Description from "@/components/Description/Description";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
import { Product } from "@/types";
import ProductInfo from "@/components/ProductInfo/ProductInfo";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";
import PopularProducts from "@/components/PopularProducts/PopularProducts";

async function fetchProductData(uri: string): Promise<Product | null> {
  try {
    const response = await fetch(`${apiUrl}/product/${uri}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

async function fetchProductDescription(about_url: string): Promise<{ html_content: string } | null> {
  try {
    const response = await fetch(about_url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html_content = await response.text();
    return { html_content };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { uri: string } }) {
  const product = await fetchProductData(params.uri);

  if (!product) {
    return;
  }

  return {
    title: `${product.title} купить в Алматы`,
    description: `idiamarket.kz предлагает купить ${product.title} с доставкой по Казахстану`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/p/${params.uri}`,
    },
  };
}

const ProductPage = async ({ params }: { params: { uri: string } }) => {
  const productPromise = fetchProductData(params.uri);
  const product = await productPromise;

  if (!product) {
    notFound();
  }

  const descriptionPromise = product.about_url ? fetchProductDescription(product.about_url) : null;
  const aboutContent = await descriptionPromise;

  const category_code = product.categories?.[product.categories.length - 1]?.category_code ?? "";

  return (
    <div className={`container ${styles.productPage}`}>
      <div className={styles.breadcrumbs}>
        <Breadcrumbs code={category_code} productName={product.title} />
      </div>

      <div className={styles.productPageBody}>
        <ProductInfo product={product} />

        {aboutContent && <Description content={aboutContent.html_content} />}

        {product.attributes && product.attributes.length > 0 ? <ProductAttributes attributes={product.attributes} /> : null}
      </div>

      <div className={styles.watched}>
        <RecentlyWatched page="product" />
      </div>

      <div className={styles.popular}>
        <PopularProducts />
      </div>
    </div>
  );
};

export default ProductPage;
