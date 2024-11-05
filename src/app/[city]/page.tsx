import { notFound } from "next/navigation";

import React, { useContext } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Banner from "@/components/Banner/Banner";
import Slider from "@/components/Slider/Slider";
import Advantages from "@/components/Advantages/Advantages";
import { Product } from "@/types";

import styles from "./Home.module.css";
import AboutAccordion from "@/components/AboutAccordion/AboutAccordion";
import Categories from "@/components/Categories/Categories";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";
import PopularProducts from "@/components/PopularProducts/PopularProducts";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface HomePageProps {
  params: {
    id: string;
  };
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const { city } = params;

  return {
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${city}`,
    },
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

      <RecentlyWatched page="home" />

      <section className={styles.popular}>
        <div className="container">
          <PopularProducts />
        </div>
      </section>

      <section className={styles.advantages}>
        <div className="container">
          <Advantages />
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
