"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import styles from "./Footer.module.css";

const Footer = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);

  const toggleSection = (setState: any) => {
    setState((prev: any) => !prev);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className="container">
          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <div className={styles.columnHeader} onClick={() => toggleSection(setIsContactsOpen)}>
                <p className={styles.columnTitle}>Контакты</p>
                <Image src="/images/icons/arrow-down.svg" width={16} height={16} alt="" />
              </div>

              <div className={`${styles.columnContent} ${isContactsOpen ? styles.columnContentActive : ""}`}>
                <div className={styles.logo}>
                  <Link href="/">
                    <Image src="/images/logo.svg" alt="Логотип" className={styles.logoImage} width={110} height={37} />
                  </Link>
                </div>

                <ul className={styles.footerContacts}>
                  <li className={styles.footerContact}>
                    <Link href="#" className={`${styles.footerLink} ${styles.contactAddress}`}>
                      <span className={styles.contactCity}>г. Алматы</span>, 050008, ул. Мынбаева 43 (уг.ул. Манаса)
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87273449900" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      8 (727) 344-99-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87012667700" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      +7 (701) 266-77-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="mailto:zakaz@idiamarket.kz" className={`${styles.footerLink} ${styles.contactMail}`}>
                      zakaz@idiamarket.kz
                    </Link>
                  </li>
                </ul>

                <ul className={styles.footerContacts}>
                  <li className={styles.footerContact}>
                    <Link href="#" className={`${styles.footerLink} ${styles.contactAddress}`}>
                      <span className={styles.contactCity}>г. Астана</span>, 010000, ул. Бейсекбаева 24/1, 2-этаж, бизнес центр DARA
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87172279900" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      8 (7172) 27-99-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87015112200" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      +7 (701) 511-22-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="mailto:astana@idiamarket.kz" className={`${styles.footerLink} ${styles.contactMail}`}>
                      astana@idiamarket.kz
                    </Link>
                  </li>
                </ul>

                <ul className={styles.footerContacts}>
                  <li className={styles.footerContact}>
                    <Link href="#" className={`${styles.footerLink} ${styles.contactAddress}`}>
                      <span className={styles.contactCity}>г. Шымкент</span>, ул. Мадели кожа 35/1, (уг.ул. Байтурсынова) 1-этаж, бизнес-центр BNK
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87273449900" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      8 (727) 344-99-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="tel:87012667700" className={`${styles.footerLink} ${styles.contactPhone}`}>
                      +7 (701) 266-77-00
                    </Link>
                  </li>
                  <li className={styles.footerContact}>
                    <Link href="mailto:zakaz@idiamarket.kz" className={`${styles.footerLink} ${styles.contactMail}`}>
                      zakaz@idiamarket.kz
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.footerColumn}>
              <div className={styles.columnHeader} onClick={() => toggleSection(setIsCategoriesOpen)}>
                <p className={styles.columnTitle}>Категории</p>
                <Image src="/images/icons/arrow-down.svg" width={16} height={16} alt="" />
              </div>

              <p className={styles.footerTitle}>Категории</p>

              <div className={`${styles.columnContent} ${isCategoriesOpen ? styles.columnContentActive : ""}`}>
                <ul className={styles.footerMenu}>
                  <li className={styles.footerItem}>
                    <Link href={`/category/metallicheskie-stellazhi/torgovye-stellazhi`} className={styles.footerLink}>
                      Торговые стеллажи
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Торговое оборудование
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Холодильное оборудование
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Оборудование для общепита
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      POS оборудование
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Коммерческая мебель
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Складские стеллажи
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Нейтральное оборудование
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Металлические шкафы
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Оборудование для аптек
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Паллетные стеллажи
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Кассовые боксы
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Витрины
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`${styles.footerColumn} ${isLinksOpen ? styles.columnContentActive : ""}`}>
              <div className={styles.columnHeader} onClick={() => toggleSection(setIsLinksOpen)}>
                <div className={styles.columnTitle}>О компании</div>
                <Image src="/images/icons/arrow-down.svg" width={16} height={16} alt="" />
              </div>

              <Link href="/" className={`${styles.footerTitle} ${styles.footerLink}`}>
                Главная
              </Link>

              <div className={`${styles.columnContent} ${isLinksOpen ? styles.columnContentActive : ""}`}>
                <ul className={styles.footerMenu}>
                  <li className={styles.footerItem}>
                    <Link href="#" className={styles.footerLink}>
                      Главная
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="#" className={styles.footerLink}>
                      Проекты
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      3D Дизайн
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Доставка
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      О нас
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Отзывы
                    </Link>
                  </li>
                  <li className={styles.footerItem}>
                    <Link href="" className={styles.footerLink}>
                      Контакты
                    </Link>
                  </li>
                </ul>
              </div>

              <div className={styles.subscribe}>
                <p className={styles.subscribeText}>Подпишитесь на последние обновления и узнавайте о новинках и специальных предложениях первыми</p>
                <input type="email" className={styles.subscribeInput} placeholder="Email" />
                <button className={styles.subscribeButton}>Подписаться</button>
              </div>

              <div className={styles.socials}>
                <Link aria-label="whatsapp" href="#" className={`${styles.socialsItem} ${styles.socialsItemWhatsapp}`}>
                  <Image className={`${styles.socialsIcon} ${styles.socialsIconWhatsapp}`} src="/images/icons/whatsapp.svg" alt="" width={24} height={24} />
                </Link>
                <Link aria-label="instagram" href="#" className={`${styles.socialsItem} ${styles.socialsItemInstagram}`}>
                  <Image className={`${styles.socialsIcon} ${styles.socialsIconInstagram}`} src="/images/icons/instagram.svg" alt="" width={24} height={24} />
                </Link>
                <Link aria-label="youtube" href="#" className={`${styles.socialsItem} ${styles.socialsItemYoutube}`}>
                  <Image className={`${styles.socialsIcon} ${styles.socialsIconYoutube}`} src="/images/icons/youtube.svg" alt="" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerCopyright}>
        <div className="container">
          <div className={styles.copyright}>
            <span>&copy; ТОО «IDIA Market» 2010-{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
