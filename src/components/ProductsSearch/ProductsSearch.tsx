"use client";
import {useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductsSearch.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";
import { getProductWord } from "@/lib/utils";
import { InitialData, FilterOptions } from "@/types";
import Pagination from "@/components/Pagination/Pagination";

interface ProductsSearchProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
  title: string;
  searchQuery: string;
}

export const ProductsSearch: React.FC<ProductsSearchProps> = ({ initialData, filterOptions, title, searchQuery }) => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);

  const { products, pagination } = initialData;
  const { totalPages, currentPage, totalProducts } = pagination;

  return (
    <div className={styles.searchPage}>
        <Filter filterOptions={filterOptions} isFilterOpen={isFilterOpen} closeFilter={closeFilter} />

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
              <Sort />
              <CardViews />
            </div>
            <div className={styles.filter} onClick={openFilter}>
              <Image src="/images/icons/filter.svg" alt="" width={20} height={20} /> Фильтры
            </div>
          </div>
        </div>

        <div>
          {products && products.length > 0 ? (
            <div className={styles.searchPageProducts} itemScope itemType="http://schema.org/ItemList">
              {products.map((product) => (
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
