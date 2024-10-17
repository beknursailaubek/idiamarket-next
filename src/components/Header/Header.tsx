"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FavoritesContext } from "@/context/FavoritesContext";
import { CityContext } from "@/context/CityContext";
import Modal from "@/components/Modal/Modal";
import Location from "@/components/Location/Location";
import Search from "@/components/Search/Search";
import Contacts from "@/components/Contacts/Contacts";
import { Tooltip } from "react-tooltip";
import styles from "./Header.module.css";
import Menu from "@/components/Menu/Menu";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const Header: React.FC = () => {
  const router = useRouter();
  const favoritesContext = useContext(FavoritesContext);
  const cityContext = useContext(CityContext);

  if (!favoritesContext) {
    throw new Error("FavoritesContext must be used within its provider");
  }
  if (!cityContext) {
    throw new Error("CityContext must be used within its provider");
  }

  const { favorites } = favoritesContext;
  const { selectedCity } = cityContext;

  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isContactsModalOpen, setContactsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<{ query: string; path: string }[]>([]);

  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const openContactsModal = () => setContactsModalOpen(true);
  const closeContactsModal = () => setContactsModalOpen(false);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchQuery = () => {
    setSearchQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      const updatedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]") as { query: string; path: string }[];

      if (!updatedHistory.some((item: { query: string }) => item.query === searchQuery)) {
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
        const response = await fetch(`${apiUrl}/products/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setSearchProducts(data.products);
      } catch (error) {
        setError("An error occurred while fetching search results.");
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery.length === 0 || searchQuery.length > 2) fetchSearchProducts();
  }, [searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={`${styles.headerInner} container`}>
            <Link href="/" className={styles.headerLogo}>
              <Image className={styles.logoImage} src="/images/logo.svg" alt="Logo" width={110} height={37} />
            </Link>

            <div className={styles.headerInfo}>
              <button className={styles.location} onClick={openLocationModal}>
                <Image src="/images/icons/location.svg" className={styles.locationIcon} alt="Location" width={16} height={16} />
                <span className={styles.locationCity}>{selectedCity?.title}</span>
              </button>
              <div className={styles.contacts}>
                <div className={styles.contactsInfo}>
                  <Image className={styles.contactsIconPhone} src="/images/icons/phone.svg" alt="Phone" width={16} height={16} />
                  <Link href="tel:87012667700" className={styles.contactsPhone}>
                    8 (701) 266-77-00
                  </Link>
                  <Image className={styles.contactsIcon} src="/images/icons/arrow-down.svg" alt="Arrow Down" width={16} height={16} />
                </div>
                <div className={styles.contactsDropdown}>
                  <div className={styles.contactsCity}>
                    <span className={styles.contactsCityName}>Алматы</span>
                    <Link href="tel:87013667700" className={styles.contactsCityPhone}>
                      +7 (701) 266-77-00
                    </Link>
                  </div>

                  <div className={styles.contactsCity}>
                    <span className={styles.contactsCityName}>Астана </span>
                    <Link href="tel:87015112200" className={styles.contactsCityPhone}>
                      +7 (701) 511-22-00
                    </Link>
                  </div>

                  <div className={styles.contactsCity}>
                    <span className={styles.contactsCityName}>Шымкент</span>
                    <Link href="tel:87012667700" className={styles.contactsCityPhone}>
                      +7 (701) 266-77-00
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.headerSchedules}>
                <span className={styles.headerSchedule}>пн-пт с 9:00 до 18:00</span>
                <span className={styles.headerSchedule}>сб с 9:00 до 16:00</span>
              </div>
            </div>

            <nav className={styles.headerMenu}>
              <ul className={styles.menuList}>
                {[
                  { name: "Главная", path: "/" },
                  { name: "Проекты", path: "" },
                  { name: "3D Дизайн", path: "" },
                  { name: "Доставка", path: "" },
                  { name: "О нас", path: "about" },
                  { name: "Отзывы", path: "" },
                  { name: "Контакты", path: "contacts" },
                ].map((item, index) => (
                  <li className={styles.menuItem} key={index}>
                    <Link href={`${cityPrefix}/${item.path}`} className={styles.menuLink} data-tooltip-id={item.path ? undefined : "link"} data-tooltip-content="В разработке" data-tooltip-place="top">
                      {item.name}
                      {!item.path && <Tooltip id="link" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.mobileActions}>
              <div className={styles.mobileCall}>
                <Image onClick={openContactsModal} className={styles.mobileCallImage} src="/images/icons/phone.gif" width={20} height={20} alt="" />
              </div>
              {isMenuOpen || isSearchOpen ? (
                <Image
                  className={styles.burger}
                  src="/images/icons/close.svg"
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => {
                    closeMenu();
                    closeSearch();
                  }}
                />
              ) : (
                <Image className={styles.burger} src="/images/icons/burger.svg" alt="" width={24} height={24} onClick={openMenu} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.headerBottom}>
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
              <div className={styles.action} data-tooltip-id="action" data-tooltip-content="В разработке" data-tooltip-place="top">
                <Image className={styles.actionIcon} src="/images/icons/heart.svg" alt="Favorite" width={30} height={30} />
                <p className={styles.actionTitle}>Избранное</p>
                {favorites && favorites.length > 0 && <span className={styles.actionCount}>{favorites.length}</span>}
                <Tooltip id="action" />
              </div>
              <div className={styles.action} data-tooltip-id="action" data-tooltip-content="В разработке" data-tooltip-place="top">
                <Image className={styles.actionIcon} src="/images/icons/compare.svg" alt="Compare" width={30} height={30} />
                <p className={styles.actionTitle}>Сравнить</p>
                <Tooltip id="action" />
              </div>
              <div className={styles.action} data-tooltip-id="action" data-tooltip-content="В разработке" data-tooltip-place="top">
                <Image className={styles.actionIcon} src="/images/icons/cart.svg" alt="Cart" width={30} height={30} />
                <p className={styles.actionTitle}>Корзина</p>
                <Tooltip id="action" />
              </div>
              <div className={styles.action} data-tooltip-id="action" data-tooltip-content="В разработке" data-tooltip-place="top">
                <Image className={styles.actionIcon} src="/images/icons/user.svg" alt="Sign In" width={30} height={30} />
                <p className={styles.actionTitle}>Вход</p>
                <Tooltip id="action" />
              </div>
            </div>
          </div>

          <Search searchQuery={searchQuery} searchProducts={searchProducts} isOpen={isSearchOpen} onClose={closeSearch} />
        </div>

        <Menu isOpen={isMenuOpen} onClose={closeMenu} />
      </header>

      <Modal isOpen={isLocationModalOpen} onClose={closeLocationModal}>
        <Location closeModal={closeLocationModal} />
      </Modal>

      {isMobile && (
        <Modal isOpen={isContactsModalOpen} onClose={closeContactsModal} type="dialog">
          <Contacts closeModal={closeContactsModal} />
        </Modal>
      )}
    </>
  );
};

export default Header;
