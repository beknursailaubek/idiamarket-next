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
import { Navigation, Pagination } from "swiper/modules";

interface SliderProps {
  dayProducts: Product[];
}

const Slider: React.FC<SliderProps> = ({ dayProducts }) => {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    // Define the resize handler to adjust the number of slides
    const handleResize = () => {
      if (window.innerWidth > 769 && window.innerWidth < 1025) {
        setSlidesPerView(3);
      } else if (window.innerWidth < 769) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    // Set the initial value based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={"day-product__slider"}>
      <p className={"px-[20px] mb-[10px] text-base font-bold "}>Товар дня</p>
      <Swiper slidesPerView={slidesPerView} loop={true} navigation={{ nextEl: ".product-card__arrow_next", prevEl: ".product-card__arrow_prev" }} modules={[Navigation]} className="product-card__swiper">
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
