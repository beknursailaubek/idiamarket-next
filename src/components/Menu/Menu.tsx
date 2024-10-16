import { useEffect } from "react";
import styles from "./Menu.module.css";
import Image from "next/image";
import Link from "next/link";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
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
      <div className={`container ${styles.menuInner}`}>
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

        <ul className={styles.menuList} onClick={onClose}>
          {[
            { name: "Главная", path: "" },
            { name: "Проекты", path: "" },
            { name: "3D Дизайн", path: "" },
            { name: "Доставка", path: "" },
            { name: "О нас", path: "" },
            { name: "Отзывы", path: "" },
            { name: "Контакты", path: "contacts" },
          ].map((item, index) => (
            <li className={styles.menuItem} key={index}>
              <Link href={`/${item.path}`} className={styles.menuLink}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* <div className={styles.schedules}> 
          <span className={styles.schedule}>пн-пт с 9:00 до 18:00</span>
          <span className={styles.schedule}>сб с 9:00 до 16:00</span>
        </div> */}
      </div>
    </div>
  );
};

export default Menu;
