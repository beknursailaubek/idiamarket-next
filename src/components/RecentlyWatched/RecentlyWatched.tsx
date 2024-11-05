"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
import { Product } from "@/types";
import styles from "./RecentlyWatched.module.css";
import ProductCardSkeleton from "@/components/ProductCard/ProductCardSkeleton";

interface RecentlyWatchedProps {
  page?: string;
}

const RecentlyWatched = ({ page }: RecentlyWatchedProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyWatched = async () => {
      const skus = JSON.parse(localStorage.getItem("recentlyWatched") || "[]");
      if (skus.length) {
        try {
          const res = await fetch(`${apiUrl}/products/sku?skus=${skus.join(",")}`);
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      }
      setLoading(false);
    };
    fetchRecentlyWatched();
  }, []);

  if (loading) {
    return (
      <div className={`${styles.body} ${page == "home" ? styles.home : ""} ${page == "product" ? styles.product : ""}`}>
        <p className={`title ${styles.title}`}>Вы недавно смотрели</p>
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className={`${styles.body} ${page == "home" ? styles.home : ""} ${page == "product" ? styles.product : ""}`}>
      <p className={`title ${styles.title}`}>Вы недавно смотрели</p>
      <div className={`${styles.list} `}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} type="" />
        ))}
      </div>
    </div>
  );
};

export default RecentlyWatched;
