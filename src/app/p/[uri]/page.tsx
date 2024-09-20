import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider/ProductSlider";
import styles from "./Product.module.css";
import Attributes from "@/components/Attributes/Attributes";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { getProductsByCategory } from "@/lib/actions";

interface Product {
  sku: string;
  title: string;
  images: string[];
  uri: string;
  rating: number;
  price: number;
  old_price?: number;
  price_from?: boolean;
  short_description?: { title: string; value: string; icon: string }[];
  stickers?: { title: string; background_color: string }[];
  variants?: {
    colors?: { uri: string; color: { hex: string; code: string } }[];
    attributes?: { attribute: { title: string; value: string }; uri: string }[];
  };
  attributes?: { title: string; items: { title: string; value: string }[] }[];
  categories?: { category_code: string }[];
}

async function fetchProductData(uri: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/product/${uri}`);
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

const ProductPage = async ({ params }: { params: { uri: string } }) => {
  const product = await fetchProductData(params.uri);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const category_code = product?.categories[product?.categories?.length - 1]?.category_code;

  const isTorgovyeStellazhi = product?.categories.some((category) => category.category_code === "torgovye-stellazhi");

  return (
    <div className="container">
      <div className={styles.productPage}>
        <Breadcrumbs code={category_code} productName={product?.title} />

        <div className={styles.productPageBody}>
          <div className={styles.productPageMain}>
            <div className={styles.productPageCard}>
              <div className={styles.productPageLeft}>
                {product.stickers && product.stickers.length > 0 ? (
                  <div className={styles.productPageStickers}>
                    {product.stickers.map((label, index) => (
                      <span key={index} style={{ background: `${label.background_color}` }} className={styles.productPageStickersLabel}>
                        {label.title}
                      </span>
                    ))}
                  </div>
                ) : null}

                <ProductSlider images={product?.images} />

                <div className={styles.productPageAdvantages}>
                  <div className={styles.productPageAdvantage}>
                    <Image className={styles.productPageAdvantageImage} src="/images/icons/secure.webp" width={16} height={16} alt="" />
                    <span className={styles.productPageAdvantageText}>Безопасная оплата</span>
                  </div>

                  <div className={styles.productPageAdvantage}>
                    <Image className={styles.productPageAdvantageImage} src="/images/icons/delivery.webp" width={16} height={16} alt="" />
                    <span className={styles.productPageAdvantageText}>Бесплатная доставка</span>
                  </div>

                  <div className={styles.productPageAdvantage}>
                    <Image className={styles.productPageAdvantageImage} src="/images/icons/support.webp" width={16} height={16} alt="" />
                    <span className={styles.productPageAdvantageText}>Консультация</span>
                  </div>
                </div>

                <div className={styles.productPageActions}>
                  <div className={styles.productPageAction}>
                    <Image className={styles.productPageActionIcon} src="/images/icons/compare.svg" width={26} height={26} alt="" />
                  </div>
                  <div className={styles.productPageAction}>
                    <Image className={styles.productPageActionIcon} src="/images/icons/heart.svg" width={26} height={26} alt="" />
                  </div>
                </div>
              </div>
              <div className={styles.productPageRight}>
                <span className={styles.productPageCode}>Код товара: {product.sku}</span>
                <h1 className="title">{product.title}</h1>
                {product.variants && product.variants.colors && product.variants.colors.length > 0 ? (
                  <div className={styles.productPageColors}>
                    <p className={styles.productPageColorsTitle}>{isTorgovyeStellazhi ? "Цвета RAL:" : "Цвета"}</p>

                    <div className={styles.productPageColorsList}>
                      {product.variants.colors.map((variant, index) => (
                        <Link key={index} href={`/p/${variant.uri}`} className={`${styles.productPageColorPallete} ${product.color.code === variant.color.code ? styles.productPageColorPalleteActive : null} `} style={{ backgroundColor: `${variant.color.hex}` }} aria-label={product?.title}></Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className={styles.productPageBuy}>
                  <div className="product-page__price">
                    {product.price_from ? <span className={styles.productPagePriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productPagePriceActual}>{formatPrice(product.price)} ₸</span>}
                    {product.old_price ? <span className={styles.productPagePriceDiscount}>{formatPrice(product.old_price)} ₸</span> : null}
                  </div>

                  {isTorgovyeStellazhi ? <button className={styles.productPageButtonCart}>Рассчитать</button> : <button className={styles.productPageButtonCart}>Купить</button>}
                </div>

                {product.variants && product.variants.attributes && product.variants.attributes.length > 0 ? (
                  <div className={styles.productPageVariants}>
                    <div className={styles.productPageVariantsList}>
                      {Object.entries(
                        product.variants.attributes.reduce((acc, variant) => {
                          const title = variant.attribute.title;
                          if (!acc[title]) acc[title] = [];
                          acc[title].push(variant);
                          return acc;
                        }, {})
                      ).map(([title, variants]) => (
                        <>
                          <p className={styles.productPageVariantsTitle}>{title}:</p>

                          <div key={title} className={styles.productPageVariantsGroup}>
                            {variants.map((variant, index) => {
                              const isActiveVariant = product.attributes.some((attributeGroup) => attributeGroup.items.some((attributeItem) => attributeItem.value === variant.attribute.value));
                              return (
                                <Link key={index} href={`/p/${variant.uri}`} className={`${styles.productPageVariantsValue} ${isActiveVariant ? styles.productPageVariantsValueActive : ""}`}>
                                  {variant.attribute.value}
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.short_description && product.short_description.length > 0 ? (
                  <>
                    <div className={styles.shortDescriptionsList}>
                      {product.short_description.map((item, index) => (
                        <div key={index} className={styles.shortDescription}>
                          <div className={styles.shortDescriptionIcon}>
                            <Image src={item.icon} alt="" width={35} height={35} />
                          </div>
                          <p>
                            <span className={styles.shortDescriptionTitle}>{item.title} — </span>
                            <span className={styles.shortDescriptionText}>{item.value}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
                <button className={styles.characteristicsBtn}>Все характеристики</button>
              </div>
            </div>
          </div>

          <Attributes attributes={product?.attributes} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
