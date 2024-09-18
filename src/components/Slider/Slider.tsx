"use client";
import Image from "next/image";
import styles from "./Slider.module.css";
import ProductCard from "../ProductCard/ProductCard";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

const Slider = ({ dayProducts }) => {
  return (
    <div className={"max-w-[310px] pt-[20px] rounded-[8px] bg-white"}>
      <p className={"px-[20px] mb-[10px] text-base font-bold "}>Товар дня</p>
      <Swiper loop={true} navigation={{ nextEl: ".product-card__arrow_next", prevEl: ".product-card__arrow_prev" }} modules={[Navigation]} className="product-card__swiper">
        {dayProducts.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductCard type={"day"} key={index} product={product} className={"pt-0"} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
