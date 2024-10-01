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
import { InitialData, Product, Filters, FilterOptions, SeoData, FilterValues } from "@/types";
import Seo from "@/components/Seo/Seo";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ProductsCategoryProps {
  initialData: InitialData;
  filterOptions: FilterOptions;
}

export const ProductsCategory: React.FC<ProductsCategoryProps> = ({ initialData, filterOptions }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<InitialData>(initialData);
  const [initialProducts, setInitialProducts] = useState<Product[]>(initialData.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialData.products);
  const [sortOption, setSortOption] = useState<string>("");

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
  const { totalPages, currentPage } = pagination;

  // Fetch product data based on filters
  useEffect(() => {
    fetchFilteredData();
  }, [filters, searchParams.get("page")]);

  const fetchFilteredData = async () => {
    const page = searchParams.get("page") || "1";
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];

    // Concatenate color filters properly
    const colorParams = filters.colors.length > 0 ? `colors=${filters.colors.join(",")}` : "";

    // Concatenate attribute filters properly
    const attributeParams = Object.entries(filters.attributes)
      .map(([key, values]) => values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
      .join("&");

    // Build URL with all parameters
    const url = `${apiUrl}/categories/${category.category_code}?page=${page}&limit=20&minPrice=${minPrice}&maxPrice=${maxPrice}${colorParams ? `&${colorParams}` : ""}${attributeParams ? `&${attributeParams}` : ""}`;

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
    <div className={styles.categoryPage}>
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} />

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

        {category.meta_data && <Seo data={category.meta_data as SeoData} />}
      </div>
    </div>
  );
};
