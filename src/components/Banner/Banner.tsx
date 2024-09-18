"use client";
import Image from "next/image";
import styles from "./Banner.module.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

const Banner = () => {
  return (
    <div className={"max-w-[970px] rounded-[8px] relative"}>
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={{ nextEl: ".bannerArrowNext", prevEl: ".bannerArrowPrev" }}
        modules={[Navigation, Pagination]}
        className={"rounded-[8px]"}
      >
        <SwiperSlide>
          <Image width={970} height={380} className="swiperSlide" src="/images/banner-1.png" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <Image width={970} height={380} className="swiperSlide" src="/images/banner-1.png" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
