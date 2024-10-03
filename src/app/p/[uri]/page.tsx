import { notFound } from "next/navigation";
import styles from "./Product.module.css";
import Attributes from "@/components/Attributes/Attributes";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Desciption from "@/components/Description/Description";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
import { Product, AttributeItem } from "@/types";
import ProductInfo from "@/components/ProductInfo/ProductInfo";

type AttributeGroup = {
  title: string;
  items: AttributeItem[];
};

async function fetchProductData(uri: string): Promise<Product | null> {
  try {
    const response = await fetch(`${apiUrl}/product/${uri}`);
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

async function fetchProductDescription(sku: string): Promise<{ html_content: string } | null> {
  try {
    const response = await fetch(`${apiUrl}/descriptions/${sku}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product description:", error);
    return null;
  }
}

const ProductPage = async ({ params }: { params: { uri: string } }) => {
  const product = await fetchProductData(params.uri);

  const category_code = product?.categories?.[product?.categories?.length - 1]?.category_code ?? "";

  if (!product) {
    notFound();
    return null;
  }

  const productDescription = await fetchProductDescription(product.sku);

  const attributeGroups: AttributeGroup[] = (product.attributes ?? []).map((attr) => ({
    title: attr.title,
    items: attr.items ?? [],
  }));

  return (
    <div className="container">
      <div className={styles.productPage}>
        <Breadcrumbs code={category_code} productName={product?.title} />

        <div className={styles.productPageBody}>
          <ProductInfo product={product} />

          {productDescription && <Desciption content={productDescription.html_content} />}

          <Attributes attributes={attributeGroups} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
