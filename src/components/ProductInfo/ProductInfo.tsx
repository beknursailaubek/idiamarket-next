"use client";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider/ProductSlider";
import { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
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

  return (
    <div className={styles.productPageMain}>
      <div className={styles.productPageCard}>
        <h1 className={`title ${styles.mobile} ${styles.titleMob}`}>{product?.title}</h1>
        <span className={`${styles.mobile} ${styles.productPageCodeMob}`}>Код товара: {product?.sku}</span>

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

          <h1 className={`title ${styles.title}`}>{product?.title}</h1>

          {product?.variants && product?.variants?.colors && product?.variants?.colors?.length > 0 ? (
            <div className={styles.productPageColors}>
              <p className={styles.productPageColorsTitle}>{isTorgovyeStellazhi ? "Цвета RAL:" : "Цвета"}</p>
              <div className={styles.productPageColorsList}>{product?.variants?.colors?.map((variant, index) => (variant.color ? <Link key={index} href={`/p/${variant.uri}`} className={`${styles.productPageColorPallete} ${product?.color?.code === variant.color.code ? styles.productPageColorPalleteActive : null} `} style={{ backgroundColor: `${variant.color.hex}` }} aria-label={product?.title}></Link> : null))}</div>
            </div>
          ) : null}

          <div className={styles.productPageBuy}>
            <div className="product-page__price">
              <span className={styles.productPagePriceActual}>
                {product?.price_from ? "от" : null} {formatPrice(product.price)} ₸
              </span>
              {product?.old_price && <span className={styles.productPagePriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
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
                          <Link key={index} href={`/p/${variant.uri}`} className={`${styles.productPageVariantsValue} ${isActiveVariant ? styles.productPageVariantsValueActive : ""}`}>
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
          <button className={styles.characteristicsBtn}>Все характеристики</button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
