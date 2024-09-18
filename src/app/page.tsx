import { notFound } from "next/navigation";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import Banner from "@/components/Banner/Banner";
import Slider from "@/components/Slider/Slider";

import styles from "./Home.module.css";

interface Product {
  sku: string;
  title: string;
  images: string[];
  uri: string;
  rating: number;
  price: number;
}

interface HomePageProps {
  params: {
    id: string;
  };
}

async function getProductsByType(type: string): Promise<Product[]> {
  const res = await fetch(`http://localhost:8080/api/products/${type}`);
  const products: Product[] = await res.json();

  if (!products || products.length === 0) notFound();
  return products;
}

export default async function HomePage({ params }: HomePageProps) {
  const dayProducts = await getProductsByType("day");
  const popularProducts = await getProductsByType("popular");
  return (
    <>
      <section className={styles.welcome}>
        <div className="container">
          <div className={"flex gap-[20px] max-h-[380px]"}>
            <Banner />
            <Slider dayProducts={dayProducts} />
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <div className="container">
          <p className={styles.categoriesTitle}>Категории</p>

          <div className={styles.categoriesBox}>
            <div className={`${styles.categoriesGroup} ${styles.categoriesGroup3}`}>
              <Link href={`/category/stellazhi/torgovye-stellazhi`} className={`${styles.categoriesItem} ${styles.categoryTorgovyeStellazhi}`}>
                <span className={styles.categoryCount}>Товаров: 0</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/torgovye-stellazhi.png" alt="Торговые стеллажи" width={100} height={100} />
                <p className={styles.categoryTitle}>Торговые стеллажи</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.popular}>
        <div className="container">
          <div className={styles.popularInner}>
            <p className={styles.popularTitle}>Популярные товары</p>
            <div className={styles.popularProducts}>
              {popularProducts.map((product, index) => (
                <ProductCard type="" product={product} key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="container">
          <h2 className={styles.aboutTitle}>Интернет магазин IDIAMARKET.KZ</h2>
          <div className={`${styles.aboutInner} ${styles.aboutInnerHidden}`}>
            <div className={styles.aboutHide}>
              <div className={styles.aboutBtn}>
                <p className={styles.aboutBtnText}>ПОДРОБНЕЕ</p>
                <Image className={styles.aboutBtnImg} src={"/images/icons/ArrowDown.svg"} alt="Toggle" width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
