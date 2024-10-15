import Link from "next/link";
import Image from "next/image";
import styles from "./Message.module.css";

const Message = () => {
  return (
    <div className={styles.message}>
      <p className={styles.title}>Товары скоро появятся!</p>
      <p className={styles.text}>Эта категория пока пуста. Но товары скоро появятся. Следите за обновлениями!</p>

      <Image className={styles.image} src="/images/coming-soon.gif" width={200} height={200} alt="" />

      <Link href="tel:87012667700" className={styles.call}>
        Получить консультацию
      </Link>

      <div className={styles.redirects}>
        <Link href="/category/metallicheskie-stellazhi" className={styles.redirect}>
          Перейти в категорию металлических стеллажей
        </Link>
        <Link href="/category/skladskie-stellazhi" className={styles.redirect}>
          Перейти в категорию складских стеллажей
        </Link>
      </div>
    </div>
  );
};

export default Message;
