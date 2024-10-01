import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Search.module.css";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  uri: string;
  images: string[];
  title: string;
  price: number;
  price_from?: boolean;
  old_price?: number;
}

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchProducts: Product[];
  searchQuery: string;
}

interface HistoryItem {
  path: string;
  query: string;
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose, searchProducts, searchQuery }) => {
  const [suitableProducts, setSuitableProducts] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchSuitableProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/popular`);
        if (!response.ok) throw new Error("Failed to fetch suitable products");
        const data = await response.json();
        setSuitableProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuitableProducts();
  }, []);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(storedHistory);
  }, [isOpen, searchQuery]);

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.searchModal} onClick={handleClickOutside}>
      <div className={styles.searchModalContent} ref={searchRef}>
        <div className={styles.searchModalInfo}>
          {searchQuery.length > 0 ? (
            <div className={styles.searchSuggestions}>
              <p className={styles.searchModalTitle}>Возможно вы ищете</p>
            </div>
          ) : (
            <div className={styles.searchOften}>
              <p className={styles.searchModalTitle}>Часто смотрят</p>
              <div className={styles.searchOftenItems}>
                <Link href={""} onClick={onClose} className={styles.searchOftenRedirect}>
                  стеллажи
                </Link>
                <Link href={""} onClick={onClose} className={styles.searchOftenRedirect}>
                  плиты
                </Link>
                <Link href={""} onClick={onClose} className={styles.searchOftenRedirect}>
                  холодильники
                </Link>
                <Link href={""} onClick={onClose} className={styles.searchOftenRedirect}>
                  морозильники
                </Link>
                <Link href={""} onClick={onClose} className={styles.searchOftenRedirect}>
                  pos
                </Link>
              </div>
            </div>
          )}
          {searchHistory.length > 0 && (
            <div className={styles.searchHistory}>
              <div className={styles.searchHistoryHeader}>
                <p className={styles.searchModalTitle}>Недавно искали</p>
                <button className={styles.searchHistoryClearBtn} onClick={clearHistory}>
                  Очистить
                </button>
              </div>
              <div className={styles.searchHistoryList}>
                {searchHistory.map((item, index) => (
                  <Link href={item.path} key={index} className={styles.searchHistoryRedirect} onClick={onClose}>
                    {item.query}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.searchModalResults}>
          <p className={styles.searchModalTitle}>Подходящие товары</p>
          {searchProducts && searchProducts.length > 0 ? (
            <div className={styles.searchResults}>
              {searchProducts.map((product) => (
                <Link href={`/p/${product.uri}`} key={product.uri} className={styles.searchCard} onClick={onClose}>
                  <img className={styles.searchCardImage} src={product.images && product.images[0] ? product.images[0] : "/default-image.png"} alt={product.title} width={60} height={60} />
                  <div className={styles.searchCardInfo}>
                    <p className={styles.searchCardTitle}>{product.title}</p>
                    {product.price_from ? <span className={styles.productCardPriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productCardPriceActual}>{formatPrice(product.price)} ₸</span>}
                    {product.old_price && <span className={styles.productCardPriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.searchResults}>
              {suitableProducts.map((product) => (
                <Link href={`/p/${product.uri}`} key={product.uri} className={styles.searchCard} onClick={onClose}>
                  <img className={styles.searchCardImage} src={product.images && product.images[0] ? product.images[0] : "/default-image.png"} alt={product.title} width={60} height={60} />
                  <div className={styles.searchCardInfo}>
                    <p className={styles.searchCardTitle}>{product.title}</p>
                    {product.price_from ? <span className={styles.productCardPriceActual}>от {formatPrice(product.price)} ₸</span> : <span className={styles.productCardPriceActual}>{formatPrice(product.price)} ₸</span>}
                    {product.old_price && <span className={styles.productCardPriceDiscount}>{formatPrice(product.old_price)} ₸</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
