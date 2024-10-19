"use client";

import { useEffect, useState, useCallback } from "react";
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

interface ProductsCategoryProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
}

export const ProductsCategory: React.FC<ProductsCategoryProps> = ({ initialData, filterOptions }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity } = useCityContext();
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  const { category, products, pagination } = initialData;

  const [tempFilters, setTempFilters] = useState<Filters>({
    priceRange: [0, Infinity],
    colors: [],
    attributes: {},
  });

  const applyFilters = useCallback(() => {
    const filterPath = buildFilterPath(tempFilters);
    router.push(`${cityPrefix}/category/${category?.uri}/f/${filterPath}`);
  }, [tempFilters, category, cityPrefix]);

  const buildFilterPath = (filters: Filters): string => {
    const { colors, attributes } = filters;

    let pathSegments = [];

    if (colors.length > 0) {
      pathSegments.push(`color/${colors.join(",")}`);
    }

    for (const [attributeCode, values] of Object.entries(attributes)) {
      if (values.length > 0) {
        pathSegments.push(`${attributeCode}/${values.join(",")}`);
      }
    }

    return pathSegments.join("/");
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleSortingAndPriceChange = (sortValue: string, priceRange: [number, number]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange[0] > 0) params.set("priceMin", priceRange[0].toString());
    if (priceRange[1] < Infinity) params.set("priceMax", priceRange[1].toString());

    if (sortValue) params.set("sorting", sortValue);

    router.push(`${cityPrefix}/category/${category?.uri}/f/${buildFilterPath(tempFilters)}?${params.toString()}`);
  };

  useEffect(() => {
    if (hasActiveFilters(tempFilters)) {
      const timeoutId = setTimeout(() => {
        applyFilters();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [tempFilters, applyFilters]);

  const hasActiveFilters = (filters: Filters): boolean => {
    return filters.colors.length > 0 || Object.values(filters.attributes).some((values) => values.length > 0);
  };

  return (
    <div className={styles.categoryPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      <div className={styles.categoryPageBody}>
        {category?.children?.length > 0 ? (
          <>
            <div className={styles.categoryPageInfo}>
              <h1 className={`title ${styles.categoryPageTitle}`}>
                {category.title} в {selectedCity.title}
              </h1>
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
                {pagination.totalProducts === 1 ? "Найден" : "Найдено"} {pagination.totalProducts} {getProductWord(pagination.totalProducts)}
              </span>
              <div className={styles.actions}>
                <Sort onSortChange={handleFilterChange} />
                <CardViews />
                <div className={styles.filter} onClick={() => {}}>
                  <Image src="/images/icons/filter.svg" alt="Filter" width={20} height={20} /> Фильтры
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.pageHeader}>
            <h1 className={`title ${styles.pageTitle}`}>
              {category?.title} в {selectedCity.title}
            </h1>
            <span className={styles.categoryPageCount}>
              {pagination.totalProducts === 1 ? "Найден" : "Найдено"} {pagination.totalProducts} {getProductWord(pagination.totalProducts)}
            </span>
          </div>
        )}

        <div>
          {products.length > 0 ? (
            <div className={styles.categoryPageProducts}>
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div>Не найдено</div>
          )}
        </div>

        {pagination.totalPages > 1 && <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />}

        {category.anchors?.length > 0 && <AnchorList items={category.anchors} />}

        <RecentlyWatched page="" />

        {category.meta_data && <Seo data={category.meta_data as SeoData} />}
      </div>
    </div>
  );
};
