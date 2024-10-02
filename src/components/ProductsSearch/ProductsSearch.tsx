"use client";
import { useEffect, useState } from "react";
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
  const [data, setData] = useState<InitialData>(initialData);
  const [initialProducts, setInitialProducts] = useState<Product[]>(initialData.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialData.products);
  const [sortOption, setSortOption] = useState<string>("popular");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tempFilters, setTempFilters] = useState<Filters>({
    priceRange: [0, Infinity],
    colors: [],
    attributes: {},
  });

  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, Infinity],
    colors: [],
    attributes: {},
  });

  const { products, pagination } = data;
  const { totalPages, currentPage, totalProducts } = pagination;

  useEffect(() => {
    fetchFilteredData();
  }, [filters, searchParams.get("page"), sortOption]);

  const fetchFilteredData = async () => {
    const page = searchParams.get("page") || "1";
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    const sortParam = sortOption ? `&sorting=${encodeURIComponent(sortOption)}` : "";

    // Concatenate color filters properly
    const colorParams = filters.colors.length > 0 ? `&colors=${filters.colors.join(",")}` : "";

    // Concatenate attribute filters properly
    const attributeParams = Object.entries(filters.attributes)
      .map(([key, values]) => values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
      .join("&");

    // Build the URL with all query parameters for filtering and sorting
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [tempFilters]);

  const applyFilters = () => {
    setFilters(tempFilters);
    goToFirstPage();
  };

  const goToFirstPage = () => {
    router.push(`?page=1`);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleSortChange = (selectedSortOption: string) => {
    setSortOption(selectedSortOption);
    goToFirstPage();
  };

  return (
    <div className={styles.searchPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      <div className={styles.searchPageBody}>
        <div className={styles.searchPageHeader}>
          <div className={styles.searchPageInfo}>
            <h1 className={`title ${styles.searchPageTitle}`}>Результаты поиска: {title}</h1>
            <span className={styles.searchPageCount}>
              {totalProducts === 1 ? "Найден" : "Найдено"} {totalProducts} {getProductWord(totalProducts)}
            </span>
          </div>
          <div className="flex gap-[20px]">
            <Sort onSortChange={handleSortChange} />
            <CardViews />
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
