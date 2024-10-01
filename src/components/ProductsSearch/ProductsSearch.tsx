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
  const [sortOption, setSortOption] = useState<string>("");
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

  const { products } = data;

  useEffect(() => {
    fetchFilteredData();
  }, [filters]);

  const fetchFilteredData = async () => {
    const page = searchParams.get("page") || "1";
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];

    // Concatenate color filters properly
    const colorParams = filters.colors.length > 0 ? `&colors=${filters.colors.join(",")}` : "";

    // Concatenate attribute filters properly
    const attributeParams = Object.entries(filters.attributes)
      .map(([key, values]) => values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
      .join("&");

    // Append sort option
    const sortParams = sortOption ? `&sort=${encodeURIComponent(sortOption)}` : "";

    // Build the URL with all query parameters for filtering and sorting
    const url = `http://localhost:8080/api/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=20&minPrice=${minPrice}&maxPrice=${maxPrice}${colorParams}${attributeParams ? `&${attributeParams}` : ""}${sortParams}`;

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
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleSortChange = (selectedSortOption: string) => {
    setSortOption(selectedSortOption);
    sortProducts(filteredProducts, selectedSortOption);
  };

  const sortProducts = (productsList: Product[], sortOption: string) => {
    let sortedProducts = [...productsList];
    switch (sortOption) {
      case "По популярности":
        sortedProducts.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case "По скидке":
        sortedProducts.sort((a, b) => {
          const discountA = a.old_price ? parseFloat(a.old_price) - parseFloat(a.price) : 0;
          const discountB = b.old_price ? parseFloat(b.old_price) - parseFloat(b.price) : 0;
          return discountB - discountA;
        });
        break;
      case "По новизне":
        sortedProducts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        break;
      case "По возрастанию цены":
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "По убыванию цены":
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  return (
    <div className={styles.searchPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      <div className={styles.searchPageBody}>
        <div className={styles.searchPageHeader}>
          <div className={styles.searchPageInfo}>
            <h1 className={`title ${styles.searchPageTitle}`}>Результаты поиска: {title}</h1>
            <span className={styles.searchPageCount}>
              {products?.length === 1 ? "Найден" : "Найдено"} {products?.length} {getProductWord(products?.length)}
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
      </div>
    </div>
  );
};
