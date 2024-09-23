import styles from "./CardViews.module.css";
import Image from "next/image";

const CardViews = () => {
  const toggleView = () => {};

  return (
    <div className={styles.views}>
      <div className={`${styles.view} ${styles.viewActive}`}>
        <Image className={styles.viewImage} src="/images/icons/view-card.svg" alt="" width={18} height={18} />
      </div>
      <div className={styles.view}>
        <Image className={styles.viewImage} src="/images/icons/view-list.svg" alt="" width={18} height={18} />
      </div>
    </div>
  );
};

export default CardViews;
