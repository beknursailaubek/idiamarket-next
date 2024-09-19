"use client";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FavoritesContext } from "../../context/FavoritesContext";

import styles from "./Header.module.css";

const Header: React.FC = () => {
  const { favorites } = useContext(FavoritesContext);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className={styles.headerTop}>
        <div className={`${styles.headerInner} container`}>
          <Link href="/" className={styles.headerLogo}>
            <Image src="/images/logo.svg" alt="Logo" width={110} height={37} />
          </Link>

          <div className={styles.headerInfo}>
            <button className={styles.location} onClick={openLocationModal}>
              <Image src="/images/icons/location.svg" className={styles.locationIcon} alt="" width={16} height={16} />
              <span className={styles.locationCity}>Алматы</span>
            </button>
            <button className={styles.contacts}>
              <Image className={styles.contactsIconPhone} src="/images/icons/phone.svg" alt="" width={16} height={16} />
              <div className={styles.contactsPhone}>8 (727) 344-99-00</div>
              <Image src="/images/icons/arrow-down.svg" alt="Arrow Down" width={16} height={16} />
            </button>
            <span className={styles.headerSchedule}>с 09:00 до 18:00 ежедневно</span>
          </div>

          <nav className={styles.headerMenu}>
            <ul className={styles.menuList}>
              {["Главная", "Проекты", "3D Дизайн", "Доставка", "О нас", "Отзывы", "Контакты"].map((item, index) => (
                <li className={styles.menuItem} key={index}>
                  <Link href="/" className={styles.menuLink}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <header className={styles.headerBottom}>
        <div className={`${styles.headerInner} container`}>
          <button className={styles.categoryBtn}>
            <Image src="/images/icons/category.svg" alt="Category" width={20} height={20} />
            <span className={styles.categoryBtnTitle}>Категории</span>
          </button>
          <div className={styles.search} onClick={openSearch}>
            <input className={styles.searchInput} type="text" placeholder="Я хочу найти" value={searchQuery} onChange={handleSearchInput} />
            {searchQuery ? <Image className={styles.searchIcon} onClick={() => setSearchQuery("")} src="/images/icons/close.svg" alt="Close" width={20} height={20} /> : <Image className={styles.searchIcon} src="/images/icons/search.svg" alt="Search" width={20} height={20} />}
          </div>
          <div className={styles.actions}>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/heart.svg" alt="Favorite" width={20} height={20} />
              <p className={styles.actionTitle}>Избранное</p>
              {favorites.length > 0 && <span className={styles.actionCount}>{favorites.length}</span>}
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/compare.svg" alt="Compare" width={20} height={20} />
              <p className={styles.actionTitle}>Сравнить</p>
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/cart.svg" alt="Cart" width={20} height={20} />
              <p className={styles.actionTitle}>Корзина</p>
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/user.svg" alt="Sign In" width={20} height={20} />
              <p className={styles.actionTitle}>Вход</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
