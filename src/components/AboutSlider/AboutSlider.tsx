"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import styles from "./AboutSlider.module.css";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

const AboutSlider = () => {
  return (
    <div className={styles.slider}>
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide className={styles.slide}>
          <Image className={styles.slideImage} src="/images/about/slide3.webp" width={1250} height={650} alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AboutSlider;
