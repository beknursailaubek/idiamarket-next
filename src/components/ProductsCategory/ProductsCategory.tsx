"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductsCategory.module.css";
import Filter from "@/components/Filter/Filter";
import Sort from "@/components/Sort/Sort";
import CardViews from "@/components/CardViews/CardViews";
import { getProductWord } from "@/lib/utils";

export const ProductsCategory = ({ products, category }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState("По популярности");

  useEffect(() => {
    sortProducts(products, sortOption);
  }, [sortOption]);

  const handleFilterChange = (filters) => {
    const { priceRange, colors, attributes } = filters;

    const filtered = products.filter((product) => {
      const productPrice = parseInt(product.price, 10);
      const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const colorMatch = colors.length === 0 || (product.color && colors.includes(product.color.code));
      const attributeMatch = Object.entries(attributes).every(([attrCode, values]) => {
        return values.some((selectedValue) => {
          return product.attributes.some((attribute) => {
            return attribute.items.some((item) => {
              return item.attribute_values === selectedValue || item.value === selectedValue;
            });
          });
        });
      });

      return priceMatch && colorMatch && attributeMatch;
    });

    setFilteredProducts(filtered);
    sortProducts(filtered, sortOption); // Keep the sort order after filtering
  };

  const handleSortChange = (selectedSortOption) => {
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
          const discountA = a.old_price ? a.old_price - a.price : 0;
          const discountB = b.old_price ? b.old_price - b.price : 0;
          return discountB - discountA;
        });
        break;
      case "По новизне":
        sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "По возрастанию цены":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "По убыванию цены":
        sortedProducts.sort((a, b) => b.price - a.price);
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
                {filteredProducts.length === 1 ? "Найден" : "Найдено"} {filteredProducts.length} {getProductWord(filteredProducts.length)}
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
                  {filteredProducts.length === 1 ? "Найден" : "Найдено"} {filteredProducts.length} {getProductWord(products.length)}
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
      </div>
    </div>
  );
};
