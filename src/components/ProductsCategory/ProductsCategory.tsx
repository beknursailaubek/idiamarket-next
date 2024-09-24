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
import { getProductWord } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { InitialData, Product, Filters } from "@/types";

interface ProductsCategoryProps {
  initialData: InitialData;
}

export const ProductsCategory: React.FC<ProductsCategoryProps> = ({ initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<InitialData>(initialData);
  const { products, category, pagination } = data;
  const { totalPages, currentPage } = pagination;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const page = searchParams.get("page") || "1";
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/api/categories/${category.category_code}?page=${page}`);
      const newData = await res.json();
      setData(newData);
      setFilteredProducts(newData.products);
    };
    fetchData();
  }, [searchParams, category.category_code]);

  useEffect(() => {
    sortProducts(products, sortOption);
  }, [sortOption, products]);

  const handleFilterChange = (filters: Filters) => {
    const { priceRange, colors, attributes } = filters;

    const filtered = products.filter((product) => {
      const productPrice = parseFloat(product.price); // Преобразуем строку в число
      const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const colorMatch = colors.length === 0 || (product && product.color && colors.includes(product.color.code));
      const attributeMatch = Object.entries(attributes).every(([attrCode, values]) => {
        return values.some((selectedValue) => {
          return product.attributes.some((attribute) => {
            return attribute.items.some((item) => {
              return item.value === selectedValue;
            });
          });
        });
      });

      return priceMatch && colorMatch && attributeMatch;
    });

    setFilteredProducts(filtered);
    sortProducts(filtered, sortOption);
  };

  const handleSortChange = (selectedSortOption: string) => {
    setSortOption(selectedSortOption);
    sortProducts(filteredProducts, selectedSortOption);
  };

  const sortProducts = (productsList, sortOption) => {
    let sortedProducts = [...productsList];
    switch (sortOption) {
      case "По популярности":
        sortedProducts.sort((a, b) => b.view_count - a.view_count);
        break;
      case "По скидке":
        sortedProducts.sort((a, b) => {
          const discountA = a.old_price ? parseFloat(a.old_price) - parseFloat(a.price) : 0;
          const discountB = b.old_price ? parseFloat(b.old_price) - parseFloat(b.price) : 0;
          return discountB - discountA;
        });
        break;
      case "По новизне":
        sortedProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    <div className={styles.categoryPage}>
      <Filter products={products} onFilterChange={handleFilterChange} />

      <div className={styles.categoryPageBody}>
        {category.children && category.children.length > 0 ? (
          <>
            <div className={styles.categoryPageInfo}>
              <h1 className={`title ${styles.categoryPageTitle}`}>{category.title}</h1>
            </div>

            <div className={styles.categoryPageRedirects}>
              {category.children.map((redirect) => (
                <Link href={`/category/${redirect.uri}`} className={styles.categoryPageRedirect} key={redirect.uri}>
                  {redirect.image ? <Image className={styles.redirectImage} src={redirect.image} alt={redirect.title} width={200} height={200} /> : null}
                  {redirect.title}
                </Link>
              ))}
            </div>

            <div className={styles.categoryPageHeader}>
              <span className={styles.categoryPageCount}>
                {pagination.totalProducts === 1 ? "Найден" : "Найдено"} {pagination.totalProducts} {getProductWord(pagination.totalProducts)}
              </span>
              <div className="flex gap-[20px]">
                <Sort onSortChange={handleSortChange} />
                <CardViews />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div className={styles.categoryPageInfo}>
                <h1 className={`title ${styles.pageTitle}`}>{category.title}</h1>
                <span className={styles.categoryPageCount}>
                  {pagination.totalProducts === 1 ? "Найден" : "Найдено"} {pagination.totalProducts} {getProductWord(pagination.totalProducts)}
                </span>
              </div>

              <div className="flex gap-[20px]">
                <Sort onSortChange={handleSortChange} />
                <CardViews />
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
      </div>
    </div>
  );
};
