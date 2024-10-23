"use client"; // Add this line to specify it's a client-side component

import styles from "./ProductCard.module.css";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CityContext } from "../../context/CityContext";
import Link from "next/link";
import Image from "next/image";
import { Product, FavoritesContextProps, CityContextProps } from "@/types";

interface ProductCardProps {
  product: Product;
  type: "day" | "";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, type }) => {
  const favoritesContext = useContext(FavoritesContext);
  const cityContext = useContext(CityContext);

  if (!favoritesContext) {
    throw new Error("FavoritesContext must be used within its provider");
  }
  if (!cityContext) {
    throw new Error("CityContext must be used within its provider");
  }

  const { favorites } = favoritesContext;
  const { selectedCity } = cityContext;

  const addToFavorite = favoritesContext.addToFavorite ?? (() => {});
  const removeFromFavorite = favoritesContext.removeFromFavorite ?? (() => {});

  const isFavorite = favorites?.includes(product.sku) ?? false;

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorite(product.sku);
    } else {
      addToFavorite(product.sku);
    }
  };

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

  function formatPrice(price: string): string {
    const numberPrice = parseFloat(price);
    return numberPrice.toLocaleString("kz", { useGrouping: true }).replace(/,/g, " ");
  }

  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  return (
    <div className={`${styles.productCard} ${type === "day" ? styles.productCardDay : ""}`} itemScope itemType="https://schema.org/Product">
      {/* Изображения и заголовки */}
      <div className={styles.productCardHeader}>
        <div className={styles.productCardStickers}>
          {product.stickers &&
            product.stickers.length > 0 &&
            product.stickers.map((label, index) => (
              <span key={index} style={{ backgroundColor: label.background_color }} className={styles.productCardLabel}>
                {label.title}
              </span>
            ))}
        </div>
        <div className={styles.productCardActions}>
          <Image className={`${styles.productCardAction} ${styles.productCardActionCompare}`} src="/images/icons/compare.svg" width={24} height={24} alt="" />
          <Image className={`${styles.productCardAction} ${isFavorite ? styles.productCardActionActive : ""}`} width={24} height={24} src="/images/icons/heart.svg" alt="" onClick={toggleFavorite} />
        </div>
      </div>
      <Link href={`${cityPrefix}/p/${product.uri}`} className={styles.productCardView} title={product.title}>
        <Image className={styles.productCardImage} src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/600x400"} alt={product.title} width={140} height={140} itemProp="image" />
      </Link>
      <Link href={`${cityPrefix}/p/${product.uri}`} className={styles.productCardTitle} title={product.title} itemProp="name" content={product.title}>
        {product.title}
      </Link>

      <div className={styles.reviews}>
        {product.reviews ? (
          <>
            <Image className={styles.reviewsIcon} src="/images/icons/star.svg" alt="Рейтинг" width={12} height={12} />
            {product.rating ? (
              <span className={styles.reviewsRating} itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                <meta itemProp="ratingValue" content={(product.rating * 0.05).toFixed(2)} />
                {(product.rating * 0.05).toFixed(2)}
              </span>
            ) : null}

            <span className={styles.reviewsText}>
              {product.rating && (
                <span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                  <span itemProp="reviewCount">{product.reviews}</span> {getReviewWord(product.reviews)}
                </span>
              )}
            </span>
          </>
        ) : (
          <span className={styles.reviewsText}>Нет отзывов</span>
        )}
      </div>

      {type === "day" ? (
        <div className={styles.productCardFooter}>
          <div className={styles.productCardPrice} itemProp="offers" itemScope itemType="https://schema.org/Offer">
            {product.price_from ? <span className={styles.productCardPriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productCardPriceActual}>{formatPrice(product.price)} ₸</span>}
            {product.old_price && <span className={styles.productCardPriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
            <meta itemProp="priceCurrency" content="KZT" />
            <meta itemProp="price" content={product.price} />
            <link itemProp="availability" href={"https://schema.org/InStock"} />
          </div>
          <button className={styles.productCardButtonCart}>Купить</button>
        </div>
      ) : (
        <>
          <div className={styles.productCardFooter}>
            <div className={styles.productCardPrice} itemProp="offers" itemScope itemType="https://schema.org/Offer">
              {product.price_from ? <span className={styles.productCardPriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productCardPriceActual}>{formatPrice(product.price)} ₸</span>}
              {product.old_price && <span className={styles.productCardPriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
              <meta itemProp="priceCurrency" content="KZT" />
              <meta itemProp="price" content={product.price} />
              <link itemProp="availability" href={"https://schema.org/InStock"} />
            </div>
          </div>
          <button className={styles.productCardButtonCart}>Купить</button>
        </>
      )}
      {/* Дополнительные свойства Schema.org */}
      <meta itemProp="description" content={product.description || ""} />
    </div>
  );
};

export default ProductCard;
