import { notFound } from "next/navigation";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import Banner from "@/components/Banner/Banner";
import Slider from "@/components/Slider/Slider";
import { Product } from "@/types";

import styles from "./Home.module.css";
import AboutAccordion from "@/components/AboutAccordion/AboutAccordion";
import Categories from "@/components/Categories/Categories";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface HomePageProps {
  params: {
    id: string;
  };
}

async function getProductsByType(type: string): Promise<Product[]> {
  const res = await fetch(`${apiUrl}/products/${type}`);
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
          <div className={styles.welcomeInner}>
            <Banner />
            <Slider dayProducts={dayProducts} />
          </div>
        </div>
      </section>

      <Categories />

      <section className={styles.watched}>
        <div className="container">
          <RecentlyWatched page="home" />
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
