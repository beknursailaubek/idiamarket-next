"use client";
import Image from "next/image";
import "./Banner.css";

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
    <div className={`banner max-w-[970px] w-full rounded-[8px] relative`}>
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={{ nextEl: ".banner__arrow_next", prevEl: ".banner__arrow_prev " }}
        modules={[Navigation, Pagination]}
        className={`banner__swiper rounded-[8px]`}
      >
        <SwiperSlide>
          <Image loading="lazy" width={970} height={380} className="swiperSlide" src="/images/banner-1.png" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <Image width={970} height={380} className="swiperSlide" src="/images/banner-1.png" alt="" />
        </SwiperSlide>
      </Swiper>

      <div className={"banner__nav"}>
        <button className={`banner__arrow banner__arrow_prev`} aria-label="Кнопка баннера">
          <Image className={"banner-arrow__icon"} src="/images/icons/arrow-left.svg" width={20} height={20} alt="" />
        </button>
        <button className={`banner__arrow banner__arrow_next`} aria-label="Кнопка баннера">
          <Image className={"banner-arrow__icon"} src="/images/icons/arrow-right.svg" width={20} height={20} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
