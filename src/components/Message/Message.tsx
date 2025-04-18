import Link from "next/link";
import Image from "next/image";
import styles from "./Message.module.css";

const Message = () => {
  return (
    <div className={styles.message}>
      <p className={styles.title}>Товары скоро появятся!</p>
      <p className={styles.text}>Эта категория на стадии разработки, но товары в наличии. Позвоните нам, чтобы получить консультацию.</p>

      <div className={styles.image}>
        <object className={styles.animated} type="image/svg+xml" data="/images/anim.svg" width={200} height={200}></object>
        <Image className={styles.logo} src="/images/logo.svg" width={50} height={17} alt="" />
      </div>

      <Link href="tel:87029942200" className={styles.call}>
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
