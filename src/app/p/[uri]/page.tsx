import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider/ProductSlider";
import styles from "./Product.module.css";

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

  return (
    <div className="container">
      <div className={styles.productPage}>
        <div className={styles.productPageBody}>
          <div className={styles.productPageMain}>
            <div className={styles.productPageCard}>
              <div className={styles.productPageLeft}>
                {product.stickers && product.stickers.length > 0 ? (
                  <div className={styles.productPageStickers}>
                    {product.stickers.map((label, index) => (
                      <span key={index} style={{ background: `${label.background_color}` }} className="product-card__label">
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
                    <p className={styles.productPageColorsTitle}>Цвета RAL:</p>

                    <div className={styles.productPageColorsList}>
                      {product.variants.colors.map((variant) => (
                        <Link href={`/p/${variant.uri}`} className={`${styles.productPageColorPallete} ${product.color.code === variant.color.code ? styles.productPageColorPalleteActive : null} `} style={{ backgroundColor: `${variant.color.hex}` }}></Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className={styles.productPageBuy}>
                  <div className="product-page__price">
                    {product.price_from ? <span className={styles.productPagePriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productPagePriceActual}>{formatPrice(product.price)} ₸</span>}
                    {product.old_price ? <span className={styles.productPagePriceDiscount}>{formatPrice(product.old_price)} ₸</span> : null}
                  </div>

                  <button className={styles.productPageButtonCart}>Рассчитать</button>
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

          <div className={`product-page__attributes attributes`}>
            <h2 className="attributes__title title">Характеристики</h2>

            <div className="attributes__list">
              {product.attributes && product.attributes.length > 0
                ? product.attributes.map((group, index) => (
                    <div key={index} className="attributes__group">
                      <p className="attributes-group__title">{group.title}</p>

                      {group.items && group.items.length > 0 ? (
                        // Group attributes by title and join values with commas
                        <ul className="attributes__items">
                          {Object.entries(
                            group.items.reduce((acc, item) => {
                              // Group by title
                              if (!acc[item.title]) {
                                acc[item.title] = [];
                              }
                              acc[item.title].push(item.value); // Collect values
                              return acc;
                            }, {})
                          ).map(([title, values], idx) => (
                            <li key={idx} className="attribute">
                              <span className="attribute__title">{title}</span>
                              {/* Join values with commas */}
                              <span className="attribute__value">{values.join(", ")}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
