import { useEffect } from "react";
import styles from "./Menu.module.css";
import Image from "next/image";
import Link from "next/link";

interface MenuProps {
  isOpen: boolean;
}

const Menu = ({ isOpen }: MenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return (
    <div className={isOpen ? `${styles.menu} ${styles.menuActive}` : `${styles.menu}`}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.rowItem}>
            <Image className={styles.contactsIconMail} src="/images/icons/mail.svg" alt="Phone" width={16} height={16} />
            <Link href="mailto:zakaz@idiamarket.kz" className={styles.contactsMail}>
              zakaz@idiamarket.kz
            </Link>
          </div>

          <div className={styles.rowItem}>
            <Image className={styles.contactsIconPhone} src="/images/icons/phone.svg" alt="Phone" width={16} height={16} />
            <Link href="tel:87273449900" className={styles.contactsPhone}>
              8 (727) 344-99-00
            </Link>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.action}>
            <Image className={styles.actionIcon} src="/images/icons/heart.svg" alt="Favorite" width={30} height={30} />
            <p className={styles.actionTitle}>Избранное</p>
          </div>
          <div className={styles.action}>
            <Image className={styles.actionIcon} src="/images/icons/compare.svg" alt="Compare" width={30} height={30} />
            <p className={styles.actionTitle}>Сравнить</p>
          </div>
          <div className={styles.action}>
            <Image className={styles.actionIcon} src="/images/icons/cart.svg" alt="Cart" width={30} height={30} />
            <p className={styles.actionTitle}>Корзина</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
