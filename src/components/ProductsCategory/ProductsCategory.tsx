"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductsCategory.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import AnchorList from "@/components/AnchorList/AnchorList";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";
import { getProductWord } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { InitialData, Product, Filters, FilterOptions, SeoData, FilterValues } from "@/types";
import Seo from "@/components/Seo/Seo";
import { useCityContext } from "@/hooks/useCityContext";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ProductsCategoryProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
}

export const ProductsCategory: React.FC<ProductsCategoryProps> = ({ initialData, filterOptions }) => {
  const { selectedCity } = useCityContext();
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<InitialData>(initialData);
  const [initialProducts, setInitialProducts] = useState<Product[]>(initialData.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialData.products);
  const [sortOption, setSortOption] = useState<string>("popular");

  const [isFilterOpen, setFilterOpen] = useState(false);
  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);

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

  const { products, category, pagination } = data;
  const { totalPages, currentPage, totalProducts } = pagination;

  // Fetch product data based on filters
  useEffect(() => {
    fetchFilteredData();
  }, [filters, searchParams.get("page"), sortOption]);

  const fetchFilteredData = async () => {
    const page = searchParams.get("page") || "1";
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    const sortParam = sortOption ? `&sorting=${encodeURIComponent(sortOption)}` : "";

    const colorParams = filters.colors.length > 0 ? `&colors=${filters.colors.join(",")}` : "";

    const attributeParams = Object.entries(filters.attributes)
      .map(([key, values]) => values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
      .join("&");

    const url = `${apiUrl}/categories/${category.category_code}?page=${page}&limit=20&minPrice=${minPrice}&maxPrice=${maxPrice}${colorParams}${attributeParams ? `&${attributeParams}` : ""}${sortParam}`;

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
    <div className={styles.categoryPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} isFilterOpen={isFilterOpen} closeFilter={closeFilter} />

      <div className={styles.categoryPageBody}>
        {category.children && category.children.length > 0 ? (
          <>
            <div className={styles.categoryPageInfo}>
              <h1 className={`title ${styles.categoryPageTitle}`}>{category.title}</h1>
            </div>

            <div className={styles.categoryPageRedirects}>
              {category.children.map((redirect) => (
                <Link href={`${cityPrefix}/category/${redirect.uri}`} className={styles.categoryPageRedirect} key={redirect.uri}>
                  {redirect.image ? <Image className={styles.redirectImage} src={redirect.image} alt={redirect.title} width={200} height={200} /> : null}
                  {redirect.title}
                </Link>
              ))}
            </div>

            <div className={styles.categoryPageHeader}>
              <span className={styles.categoryPageCount}>
                {totalProducts === 1 ? "Найден" : "Найдено"} {totalProducts} {getProductWord(totalProducts)}
              </span>
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
          </>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div className={styles.categoryPageInfo}>
                <h1 className={`title ${styles.pageTitle}`}>{category.title}</h1>
                <span className={styles.categoryPageCount}>
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
          </>
        )}

        <div>
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className={styles.categoryPageProducts}>
              {filteredProducts.map((product) => (
                <ProductCard type="" key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div>Не найдено</div>
          )}
        </div>
        {pagination && pagination.totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} />}

        {category.anchors?.length ? <AnchorList items={category.anchors} /> : null}

        <RecentlyWatched page="" />

        {category.meta_data && <Seo data={category.meta_data as SeoData} />}
      </div>
    </div>
  );
};
