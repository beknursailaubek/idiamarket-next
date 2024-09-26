"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CityContext } from "@/context/CityContext";
import Modal from "../Modal/Modal";
import Location from "../Location/Location";
import Search from "../Search/Search";

import styles from "./Header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const { favorites } = useContext(FavoritesContext);
  const { selectedCity } = useContext(CityContext);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchQuery = () => {
    setSearchQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      const updatedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

      if (!updatedHistory.some((item) => item.query === searchQuery)) {
        updatedHistory.unshift({ query: searchQuery, path: `/search/${searchQuery}` });
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory.slice(0, 5)));
        setSearchHistory(updatedHistory.slice(0, 5));
      }

      router.push(`/search/${searchQuery}`);

      event.currentTarget.blur();
      closeSearch();
    }
  };

  useEffect(() => {
    const fetchSearchProducts = async () => {
      if (!searchQuery) {
        setSearchProducts([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/products/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setSearchProducts(data);
      } catch (error) {
        setError("An error occurred while fetching search results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchProducts();
  }, [searchQuery]);

  return (
    <>
      <div className={styles.headerTop}>
        <div className={`${styles.headerInner} container`}>
          <Link href="/" className={styles.headerLogo}>
            <Image className={styles.logoImage} src="/images/logo.svg" alt="Logo" width={110} height={37} />
          </Link>

          <div className={styles.headerInfo}>
            <button className={styles.location} onClick={openLocationModal}>
              <Image src="/images/icons/location.svg" className={styles.locationIcon} alt="Location" width={16} height={16} />
              <span className={styles.locationCity}>{selectedCity.title}</span>
            </button>
            <button className={styles.contacts}>
              <Image className={styles.contactsIconPhone} src="/images/icons/phone.svg" alt="Phone" width={16} height={16} />
              <div className={styles.contactsPhone}>8 (727) 344-99-00</div>
              <Image className={styles.contactsIcon} src="/images/icons/arrow-down.svg" alt="Arrow Down" width={16} height={16} />
            </button>
            <span className={styles.headerSchedule}>с 09:00 до 18:00 ежедневно</span>
          </div>

          <nav className={styles.headerMenu}>
            <ul className={styles.menuList}>
              {["Главная", "Проекты", "3D Дизайн", "Доставка", "О нас", "Отзывы", "Контакты"].map((item, index) => (
                <li className={styles.menuItem} key={index}>
                  <Link href={cityPrefix} className={styles.menuLink}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Image className={styles.burger} src="/images/icons/burger.svg" alt="" width={24} height={24} />
        </div>
      </div>

      <header className={styles.headerBottom}>
        <div className={`${styles.headerInner} container`}>
          <button className={styles.categoryBtn}>
            <Image src="/images/icons/category.svg" alt="Category" className={styles.categoryBtnIcon} width={20} height={20} />
            <span className={styles.categoryBtnTitle}>Категории</span>
          </button>

          <div className={styles.search} onClick={openSearch}>
            <input className={styles.searchInput} type="text" placeholder="Я хочу найти" value={searchQuery} onChange={handleSearchInput} onKeyDown={handleKeyDown} onBlur={openSearch} />
            {searchQuery ? <Image className={styles.searchIcon} src="/images/icons/close.svg" alt="Clear" onClick={handleSearchQuery} width={20} height={20} /> : <Image className={styles.searchIcon} src="/images/icons/search.svg" alt="Search" width={20} height={20} onClick={openSearch} />}
          </div>

          <div className={styles.actions}>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/heart.svg" alt="Favorite" width={30} height={30} />
              <p className={styles.actionTitle}>Избранное</p>
              {favorites.length > 0 && <span className={styles.actionCount}>{favorites.length}</span>}
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/compare.svg" alt="Compare" width={30} height={30} />
              <p className={styles.actionTitle}>Сравнить</p>
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/cart.svg" alt="Cart" width={30} height={30} />
              <p className={styles.actionTitle}>Корзина</p>
            </div>
            <div className={styles.action}>
              <Image className={styles.actionIcon} src="/images/icons/user.svg" alt="Sign In" width={30} height={30} />
              <p className={styles.actionTitle}>Вход</p>
            </div>
          </div>
        </div>

        <Search searchQuery={searchQuery} searchProducts={searchProducts} isOpen={isSearchOpen} onClose={closeSearch} />
      </header>

      <Modal isOpen={isLocationModalOpen} onClose={closeLocationModal}>
        <Location closeModal={closeLocationModal} />
      </Modal>
    </>
  );
};

export default Header;
