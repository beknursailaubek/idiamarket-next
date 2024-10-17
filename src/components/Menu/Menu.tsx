import { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import Image from "next/image";
import Link from "next/link";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={isOpen ? `${styles.menu} ${styles.menuActive}` : `${styles.menu}`}>
      <div className={`container ${styles.menuInner}`}>
        <div className={styles.row}>
          <Link href="mailto:zakaz@idiamarket.kz" className={`${styles.rowItem} ${styles.contactsMail}`}>
            <Image className={styles.contactsIconMail} src="/images/icons/mail.svg" alt="Phone" width={16} height={16} />
            zakaz@idiamarket.kz
          </Link>

          <Link href="tel:87273449900" className={`${styles.rowItem} ${styles.contactsPhone}`}>
            <Image className={styles.contactsIconPhone} src="/images/icons/phone.svg" alt="Phone" width={16} height={16} />8 (727) 344-99-00
          </Link>
        </div>

        {/* <div className={styles.actions}>
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
        </div> */}

        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href={`/`} className={styles.menuLink} onClick={onClose}>
              Главная
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={`/about`} className={styles.menuLink} onClick={onClose}>
              О нас
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={`/contacts`} className={styles.menuLink} onClick={onClose}>
              Контакты
            </Link>
          </li>
          <li className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownActive : ""}`} onClick={toggleDropdown}>
            <div className={styles.dropdownBtn}>
              Категории <Image src="/images/icons/arrow-down.svg" alt="" width={16} height={16} />
            </div>

            <ul className={styles.dropdownList}>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/metallicheskie-stellazhi" onClick={onClose}>
                  Металлические стеллажи
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/stellazhi/skladskie-stellazhi/arhivnye-stellazhi" onClick={onClose}>
                  Архивные стеллажи
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/metallicheskie-stellazhi/torgovye-stellazhi" onClick={onClose}>
                  Торговые стеллажи
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/stellazhi/torgovye-stellazhi/pristennye-stellazhi" onClick={onClose}>
                  Пристенные стеллажи
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/stellazhi/torgovye-stellazhi/ostrovnye-stellazhi" onClick={onClose}>
                  Островные стеллажи
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/category/stellazhi/torgovye-stellazhi/uglovye-stellazhi" onClick={onClose}>
                  Угловные стеллажи
                </Link>
              </li>
            </ul>
          </li>
        </ul>

        <div className={styles.schedules}>
          <Image src="/images/icons/clock.svg" width={16} height={16} alt="" />
          <span className={styles.schedule}>пн-пт с 9:00 до 18:00</span>
        </div>

        <div className={styles.schedules}>
          <Image src="/images/icons/clock.svg" width={16} height={16} alt="" />
          <span className={styles.schedule}>сб с 9:00 до 16:00</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
