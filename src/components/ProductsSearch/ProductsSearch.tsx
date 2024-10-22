"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductsSearch.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";
import { getProductWord } from "@/lib/utils";
import { Product, Filters, InitialData, FilterOptions, FilterValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ProductsSearchProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
  title: string;
  searchQuery: string;
}

export const ProductsSearch: React.FC<ProductsSearchProps> = ({ initialData, filterOptions, title, searchQuery }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstRender = useRef(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<InitialData>(initialData);
  const [initialProducts, setInitialProducts] = useState<Product[]>(initialData.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialData.products);
  const [sortOption, setSortOption] = useState<string>("popular");

  const [isFilterOpen, setFilterOpen] = useState(false);
  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);

  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, Infinity],
    colors: [],
    attributes: {},
  });

  const { products, pagination } = data;
  const { totalPages, currentPage, totalProducts } = pagination;

  useEffect(() => {
    setIsInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialized) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchFilteredData();
  }, [filters, searchParams.get("page"), sortOption, isInitialized]);

  const fetchFilteredData = async () => {
    const page = searchParams.get("page") || "1";
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    const sortParam = sortOption ? `&sorting=${encodeURIComponent(sortOption)}` : "";

    const colorParams = filters.colors.length > 0 ? filters.colors.map((color) => `&colors=${encodeURIComponent(color)}`).join("") : "";

    const attributeParams = Object.entries(filters.attributes)
      .map(([key, values]) => values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
      .join("&");

    const url = `${apiUrl}/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=20&minPrice=${minPrice}&maxPrice=${maxPrice}${colorParams}${attributeParams ? `&${attributeParams}` : ""}${sortParam}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");

      const newData = await res.json();
      setData(newData);
      setFilteredProducts(newData.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const goToFirstPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const queryString = params.toString();

    router.push(`${window.location.pathname}?${queryString}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    goToFirstPage();
  };

  const handleSortChange = (selectedSortOption: string) => {
    setSortOption(selectedSortOption);
    goToFirstPage();
  };

  return (
    <div className={styles.searchPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} isFilterOpen={isFilterOpen} closeFilter={closeFilter} />

      <div className={styles.searchPageBody}>
        <div className={styles.searchPageHeader}>
          <div className={styles.searchPageInfo}>
            <h1 className={`title ${styles.searchPageTitle}`}>Результаты поиска: {title}</h1>
            <span className={styles.searchPageCount}>
              {totalProducts === 1 ? "Найден" : "Найдено"} {totalProducts} {getProductWord(totalProducts)}
            </span>
          </div>
          <div className={styles.actions}>
            <div className={styles.view}>
              <Sort onSortChange={handleSortChange} />
              <CardViews />
            </div>
            <div className={styles.filter} onClick={openFilter}>
              <Image src="/images/icons/filter.svg" alt="" width={20} height={20} /> Фильтры
            </div>
          </div>
        </div>

        <div>
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className={styles.searchPageProducts}>
              {filteredProducts.map((product) => (
                <ProductCard type="" key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div>Не найдено</div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} />}
      </div>
    </div>
  );
};
