import { notFound } from "next/navigation";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import Banner from "@/components/Banner/Banner";
import Slider from "@/components/Slider/Slider";

import styles from "./Home.module.css";
import AboutAccordion from "@/components/AboutAccordion/AboutAccordion";

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

async function getCategoryCounts(): Promise<Record<string, number>> {
  const categoryCodes = ["torgovye-stellazhi", "palletnye-stellazhi", "skladskie-stellazhi", "metallicheskie-shkafy", "oborudovanie-dlya-aptek", "nejtralnoe-oborudovanie", "vitriny"];

  const res = await fetch(`http://localhost:8080/api/categories/count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category_codes: categoryCodes }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export default async function HomePage({ params }: HomePageProps) {
  const dayProducts = await getProductsByType("day");
  const popularProducts = await getProductsByType("popular");
  const categoryCounts = await getCategoryCounts();

  return (
    <>
      <section className={styles.welcome}>
        <div className="container">
          <div className={styles.welcomeInner}>
            <Banner />
            <Slider dayProducts={dayProducts} />
          </div>
        </div>
      </section>

      <section className={""}>
        <div className="container">
          <p className={"title"}>Категории</p>

          <div className={"h-[600px] flex gap-[20px]"}>
            <div className={`grid gap-[20px] grid-rows-3`}>
              <Link href={`/category/stellazhi/torgovye-stellazhi`} className={`${styles.category} row-span-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["torgovye-stellazhi"] || 79}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/torgovye-stellazhi.png" alt="Торговые стеллажи" width={142} height={275} />
                <p className={styles.categoryTitle}>Торговые стеллажи</p>
              </Link>

              <Link target="_blank" href="https://mebelcenter.kz/" className={`${styles.category} ${styles.categoryMd}`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["kommercheskaya-mebel"] || 6}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/kommercheskaya-mebel.png" alt="Коммерческая мебель" width={170} height={133} />
                <p className={styles.categoryTitle}>Коммерческая мебель</p>
              </Link>
            </div>

            <div className="grid gap-[20px] grid-rows-4">
              <Link target="_blank" href="https://softgroup.kz/" className={`${styles.category}   ${styles.categorySm} row-start-1 col-start-1`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["kassovye-boksy"] || 77}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/kassovye-boksy.png" alt="Кассовые боксы" width={170} height={133} />
                <p className={styles.categoryTitle}>Кассовые боксы</p>
              </Link>
              <Link href={`/category/palletnye-stellazhi`} className={`${styles.category}  ${styles.categorySm} row-start-2 col-start-1`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["palletnye-stellazhi"] || 4}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/palletnye-stellazhi.png" alt="Паллетные стеллажи" width={170} height={133} />
                <p className={styles.categoryTitle}>Паллетные стеллажи</p>
              </Link>
              <Link href={`/category/skladskie-stellazhi`} className={`${styles.category} col-start-2 row-span-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["skladskie-stellazhi"] || 9}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/skladskie-stellazhi.png" alt="Складские стеллажи" width={170} height={133} />
                <p className={styles.categoryTitle}>Складские стеллажи</p>
              </Link>
              <Link target="_blank" href="https://softgroup.kz/" className={`${styles.category} row-span-2 col-span-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["torgovoe-oborudovanie"] || 154}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/torgovoe-oborudovanie.png" alt="Торговое оборудование" width={345} height={192} />
                <p className={styles.categoryTitle}>Торговое оборудование</p>
              </Link>
            </div>

            <div className="grid gap-[20px] grid-rows-3">
              <Link target="_blank" href="https://icegroup.kz/" className={`${styles.category} col-span-2 row-start-1`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["holodilnoe-oborudovanie"] || 416}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/holodilnoe-oborudovanie.png" alt="Холодильное оборудование" width={234} height={109} />
                <p className={styles.categoryTitle}>Холодильное оборудование</p>
              </Link>
              <Link target="_blank" href="https://softgroup.kz/" className={`${styles.category}  ${styles.categoryMd} col-start-1 row-start-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["pos-oborudovanie"] || 135}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/pos-oborudovanie.png" alt="POS оборудование" width={170} height={133} />
                <p className={styles.categoryTitle}>POS оборудование</p>
              </Link>
              <Link href={`/category/vitriny`} className={`${styles.category}  ${styles.categoryMd} col-start-1 row-start-3`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["vitriny"] || 29}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/vitriny.png" alt="Витрины" width={170} height={133} />
                <p className={styles.categoryTitle}>Витрины </p>
              </Link>
              <Link href={`/category/metallicheskie-shkafy`} className={`${styles.category} col-start-2 row-start-2 row-span-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["metallicheskie-shkafy"] || 107}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/metallicheskie-shkafy.png" alt="Металлические шкафы" width={135} height={275} />
                <p className={styles.categoryTitle}>Металлические шкафы</p>
              </Link>
            </div>

            <div className="grid gap-[20px] grid-rows-4">
              <Link href={`/category/oborudovanie-dlya-aptek`} className={`${styles.category}  ${styles.categorySm}`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["oborudovanie-dlya-aptek"] || 6}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/oborudovanie-dlya-aptek.png" alt="Оборудование для аптек" width={102} height={84} />
                <p className={styles.categoryTitle}>Оборудование для аптек</p>
              </Link>
              <Link href={`/category/nejtralnoe-oborudovanie`} className={`${styles.category} row-start-2 row-span-2`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["nejtralnoe-oborudovanie"] || 253}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/nejtralnoe-oborudovanie.png" alt="Нейтральное оборудование" width={160} height={192} />
                <p className={styles.categoryTitle}>Нейтральное оборудование</p>
              </Link>
              <Link target="_blank" href="https://horest.kz/" className={`${styles.category}  ${styles.categorySm}`}>
                <span className={styles.categoryCount}>Товаров: {categoryCounts["oborudovanie-dlya-obshepita"] || 659}</span>
                <Image loading="lazy" className={styles.categoryImage} src="/images/categories/oborudovanie-dlya-obshepita.png" alt="Оборудование для общепита" width={146} height={84} />
                <p className={styles.categoryTitle}>Оборудование для общепита</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.popular}>
        <div className="container">
          <div className={styles.popularInner}>
            <p className={"title"}>Популярные товары</p>
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
          <AboutAccordion />
        </div>
      </section>
    </>
  );
}
