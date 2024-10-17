"use client";
import Image from "next/image";
import "./ContactsSlider.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const ContactsSlider = () => {
  return (
    <div className="contact-page__slide_container">
      <Swiper
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        className="contact-page__slider"
        loop={true}
        modules={[Autoplay, Navigation, Pagination]}
        pagination={{
          clickable: true,
        }}
        navigation={{ nextEl: ".contact-page__arrow_next", prevEl: ".contact-page__arrow_prev" }}
      >
        <SwiperSlide className="contact-page__slide">
          <Image className="contact-page__slide-image" loading="lazy" width={1140} height={500} src="/images/contacts/banner-1.png" alt="" />
        </SwiperSlide>
        <SwiperSlide className="contact-page__slide">
          <Image className="contact-page__slide-image" loading="lazy" width={1140} height={500} src="/images/contacts/banner-1.png" alt="" />
        </SwiperSlide>
      </Swiper>

      <div className="contact-page__nav">
        <button className="contact-page__arrow contact-page__arrow_prev" aria-label="Кнопка слайдера">
          <Image className="contact-page-arrow__icon" src="/images/icons/arrow-left.svg" width={20} height={20} alt="" />
        </button>
        <button className="contact-page__arrow contact-page__arrow_next" aria-label="Кнопка слайдера">
          <Image className="contact-page-arrow__icon" src="/images/icons/arrow-right.svg" width={20} height={20} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ContactsSlider;
