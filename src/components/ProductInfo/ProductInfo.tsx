"use client";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ProductSlider from "@/components/ProductSlider/ProductSlider";
import { useCityContext } from "@/hooks/useCityContext";
import { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { selectedCity } = useCityContext();
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ru-RU").format(Number(price));
  };

  const isTorgovyeStellazhi = product?.categories?.some((category) => category?.category_code === "torgovye-stellazhi") ?? false;

  const formattedAttributes =
    product?.variants?.attributes?.reduce((acc, variant) => {
      const title = variant.attribute?.title;

      if (title) {
        if (!acc[title]) acc[title] = [];
        acc[title].push(variant);
      }
      return acc;
    }, {} as Record<string, typeof product.variants.attributes>) || {};

  const getReviewWord = (count: number) => {
    switch (true) {
      case count % 10 === 1 && count % 100 !== 11:
        return "отзыв";
      case [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100):
        return "отзыва";
      default:
        return "отзывов";
    }
  };

  useEffect(() => {
    if (product.sku) {
      let recentlyWatched = JSON.parse(localStorage.getItem("recentlyWatched") || "[]");

      if (!recentlyWatched.includes(product.sku)) {
        recentlyWatched = [product.sku, ...recentlyWatched].slice(0, 4);
        localStorage.setItem("recentlyWatched", JSON.stringify(recentlyWatched));
      }
    }
  }, [product.sku]);

  return (
    <div className={styles.productPageMain}>
      <div className={styles.productPageCard} itemScope itemType="https://schema.org/Product">
        <div className={styles.headerMob}>
          <h1 className={`title ${styles.mobile} ${styles.titleMob}`} itemProp="name" content={product.title}>
            {product?.title}
          </h1>
          <span className={`${styles.mobile} ${styles.productPageCodeMob}`}>Код товара: {product?.sku}</span>
        </div>

        <div className={styles.productPageLeft}>
          {product?.stickers && product?.stickers?.length > 0 && (
            <div className={styles.productPageStickers}>
              {product?.stickers?.map((label, index) => (
                <span key={index} style={{ background: `${label.background_color}` }} className={styles.productPageStickersLabel}>
                  {label.title}
                </span>
              ))}
            </div>
          )}

          <ProductSlider images={product?.images ?? []} />

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
          <span className={styles.productPageCode}>Код товара: {product?.sku}</span>

          <h1 className={`title ${styles.title}`} itemProp="name" content={product.title}>
            {product?.title}
          </h1>

          {product?.variants && product?.variants?.colors && product?.variants?.colors?.length > 0 ? (
            <div className={styles.productPageColors}>
              <p className={styles.productPageColorsTitle}>{isTorgovyeStellazhi ? "Цвета RAL:" : "Цвета"}</p>
              <div className={styles.productPageColorsList}>{product?.variants?.colors?.map((variant, index) => (variant.color ? <Link key={index} href={`${cityPrefix}/p/${variant.uri}`} className={`${styles.productPageColorPallete} ${product?.color?.code === variant.color.code ? styles.productPageColorPalleteActive : null} `} style={{ backgroundColor: `${variant.color.hex}` }} aria-label={product?.title}></Link> : null))}</div>
            </div>
          ) : null}

          <div className={styles.productPageBuy} itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="product-page__price">
              <span className={styles.productPagePriceActual}>
                {product?.price_from ? "от" : null} {formatPrice(product.price)} ₸
              </span>
              {product?.old_price && <span className={styles.productPagePriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
              <meta itemProp="priceCurrency" content="KZT" />
              <meta itemProp="price" content={product.price} />
              <Link itemProp="availability" href={"https://schema.org/InStock"} />
            </div>

            {isTorgovyeStellazhi ? <button className={styles.productPageButtonCart}>Рассчитать</button> : <button className={styles.productPageButtonCart}>Купить</button>}
          </div>

          {product?.variants && product.variants.attributes && product.variants.attributes.length > 0 && (
            <div className={styles.productPageVariants}>
              <div className={styles.productPageVariantsList}>
                {Object.entries(formattedAttributes).map(([title, variants]) => (
                  <div key={title}>
                    <p className={styles.productPageVariantsTitle}>{title}:</p>

                    <div className={styles.productPageVariantsGroup}>
                      {variants.map((variant, index) => {
                        const isActiveVariant = product.attributes?.some((attributeGroup) => attributeGroup.items?.some((attributeItem) => attributeItem.value === variant.attribute?.value));

                        return (
                          <Link key={index} href={`${cityPrefix}/p/${variant.uri}`} className={`${styles.productPageVariantsValue} ${isActiveVariant ? styles.productPageVariantsValueActive : ""}`}>
                            {variant.attribute?.value}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`${styles.mobile} ${styles.productPageBuyMob}`}>
            <div>
              <div className={styles.reviews}>
                {product.reviews ? (
                  <>
                    <Image className={styles.reviewsIcon} src="/images/icons/star.svg" alt="" width={20} height={20} />
                    {product.rating ? <span className={styles.reviewsRating}>{(product.rating * 0.05).toFixed(2)}</span> : <span className={styles.reviewsRating}>5.00</span>}

                    <span className={styles.reviewsText}>
                      ({product.reviews} {getReviewWord(product.reviews)})
                    </span>
                  </>
                ) : (
                  <span className={styles.reviewsText}>Нет отзывов</span>
                )}
              </div>

              <div className="product-page__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span className={styles.productPagePriceActual}>
                  {product?.price_from ? "от" : null} {formatPrice(product.price)} ₸
                </span>
                {product?.old_price && <span className={styles.productPagePriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
                <meta itemProp="priceCurrency" content="KZT" />
                <meta itemProp="price" content={product.price} />
                <link itemProp="availability" href={"https://schema.org/InStock"} />
              </div>
            </div>

            {isTorgovyeStellazhi ? <button className={styles.productPageButtonCart}>Рассчитать</button> : <button className={styles.productPageButtonCart}>Купить</button>}
          </div>

          {product?.short_description && product.short_description?.length > 0 && (
            <div className={styles.shortDescriptionsList}>
              {product.short_description.map((item, index) => (
                <div key={index} className={styles.shortDescription}>
                  <div className={styles.shortDescriptionIcon}>
                    <Image src={`${item.icon}`} alt="" width={35} height={35} />
                  </div>
                  <p>
                    <span className={styles.shortDescriptionTitle}>{item.title} — </span>
                    <span className={styles.shortDescriptionText}>{item.value}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Дополнительные свойства Schema.org */}
      <meta itemProp="description" content={product.description || ""} />
    </div>
  );
};

export default ProductInfo;
