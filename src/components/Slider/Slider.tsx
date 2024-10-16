"use client";
import Image from "next/image";
import "./Slider.css";
import ProductCard from "../ProductCard/ProductCard";
import { Product } from "@/types";
import { useState, useEffect } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface SliderProps {
  dayProducts: Product[];
}

const Slider: React.FC<SliderProps> = ({ dayProducts }) => {
  return (
    <div className={"day-product__slider"}>
      <p className={"px-[20px] mb-[10px] text-base font-bold "}>Товар дня</p>
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={{ nextEl: ".product-card__arrow_next", prevEl: ".product-card__arrow_prev" }}
        modules={[Autoplay, Navigation]}
        className="product-card__swiper"
      >
        {dayProducts.map((product: Product, index: number) => (
          <SwiperSlide key={index}>
            <ProductCard type={"day"} key={index} product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="product-card__nav">
        <button className="product-card__arrow product-card__arrow_prev" aria-label="Кнопка слайдера">
          <Image className="product-card-arrow__icon" src="/images/icons/arrow-left.svg" width={20} height={20} alt="" />
        </button>
        <button className="product-card__arrow product-card__arrow_next" aria-label="Кнопка слайдера">
          <Image className="product-card-arrow__icon" src="/images/icons/arrow-right.svg" width={20} height={20} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
