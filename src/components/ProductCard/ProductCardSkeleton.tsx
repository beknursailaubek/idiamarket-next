import styles from "./ProductCardSkeleton.module.css";

const ProductCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonSticker}></div>
        <div className={styles.skeletonActions}>
          <div className={styles.skeletonIcon}></div>
          <div className={styles.skeletonIcon}></div>
        </div>
      </div>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonReviews}></div>
      <div className={styles.skeletonPrice}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  );
};

export default ProductCardSkeleton;
