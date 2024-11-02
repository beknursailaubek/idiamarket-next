// src/components/ProductsCategory/ProductsCategory.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductsCategory.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";
import Pagination from "@/components/Pagination/Pagination";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";
import AnchorList from "@/components/AnchorList/AnchorList";
import { getProductWord } from "@/lib/utils";
import { InitialData, FilterOptions } from "@/types";
import Seo from "@/components/Seo/Seo";
import Faq from "@/components/Faq/Faq";
import { useCityContext } from "@/hooks/useCityContext";

interface ProductsCategoryProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
}

export const ProductsCategory: React.FC<ProductsCategoryProps> = ({ initialData, filterOptions }) => {
  const { selectedCity } = useCityContext();
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  const [isFilterOpen, setFilterOpen] = useState(false);
  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);

  const { products, category, pagination } = initialData;
  const { totalPages, currentPage, totalProducts } = pagination;

  return (
    <div className={styles.categoryPage}>
      <Filter filterOptions={filterOptions} isFilterOpen={isFilterOpen} closeFilter={closeFilter} />
      <div className={styles.categoryPageBody}>
        {category.children && category.children.length > 0 ? (
          <>
            <div className={styles.categoryPageInfo}>
              <h1 className={`title ${styles.categoryPageTitle}`}>
                {category.title} {`в ${selectedCity.title}`}
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
                {totalProducts === 1 ? "Найден" : "Найдено"} {totalProducts} {getProductWord(totalProducts)}
              </span>
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
          </>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div className={styles.categoryPageInfo}>
                <h1 className={`title ${styles.pageTitle}`}>
                  {category.title} {`в ${selectedCity.title}`}
                </h1>
                <span className={styles.categoryPageCount}>
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
          </>
        )}

        <div>
          {products && products.length > 0 ? (
            <div className={styles.categoryPageProducts} itemScope itemType="http://schema.org/ItemList">
              {products.map((product) => (
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

        {category.meta_data && <Seo data={category.meta_data} />}

        {category.faq && <Faq data={category.faq} />}
      </div>
    </div>
  );
};

export default ProductsCategory;
