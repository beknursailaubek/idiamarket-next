"use client";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import styles from "./About.module.css";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

const AboutPage = () => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Breadcrumbs page={"about"} />

        <div className={styles.contentBox}>
          {/* Заголовок */}
          <h1 className={`${styles.title} title`}>О компании</h1>

          {/* Описание компании */}
          <div className={styles.desc}>
            <p className={styles.descTitle}>Компания IDIA Market, основанная в 2010, является надежным партнером в области торгового, холодильного и складского оборудования в Казахстане. Мы специализируемся на предоставлении широкого ассортимента высококачественных товаров для бизнеса по доступным ценам.</p>
            <p className={styles.descText}>IDIA Market располагает развитой сетью доставки, охватывающей все регионы Казахстана, включая Алматы, Астану, Шымкент, Караганду, Тараз и другие города. Наша компания гордится высококвалифицированной командой специалистов и собственными сервисными центрами, обеспечивающими квалифицированное обслуживание и поддержку клиентов.</p>
          </div>

          {/* Слайдер */}
          <div className={styles.slider}>
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              centeredSlides={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              loop={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide className={styles.slide}>
                <Image className={styles.slideImage} src="/images/about/1.webp" width={700} height={500} alt="" />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <Image className={styles.slideImage} src="/images/about/2.webp" width={700} height={500} alt="" />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <Image className={styles.slideImage} src="/images/about/3.webp" width={700} height={500} alt="" />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <Image className={styles.slideImage} src="/images/about/4.webp" width={700} height={500} alt="" />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Основные направления */}
          <div className={styles.directions}>
            <p className={styles.directionsTitle}>Основные направления деятельности компании</p>

            <div className={styles.direction}>
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>3D Проектирование</p>
                <p className={styles.directionText}>Создаем удобные и привлекательные 3D проекты любой уровни сложности. Бесплатная визуализация помогает избежать ошибок при реализации.</p>
              </div>
              <Image src="/images/about/1.webp" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/2.webp" width={500} height={450} alt="" className={styles.directionImage} />
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Оснащение</p>
                <p className={styles.directionText}>Оптимальная планировка и эффективное размещение оборудования. Предлагаем разнообразные и эксклюзивные решения для вашего бизнеса.</p>
              </div>
            </div>

            <div className={styles.direction}>
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Розничная и оптовая продажа</p>
                <p className={styles.directionText}>Широкий ассортимент оборудования от ведущих брендов. Скоро откроется наш новый крупный склад, обеспечивающий быструю доставку по всему Казахстану.</p>
              </div>
              <Image src="/images/about/4.webp" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/3.webp" width={500} height={450} alt="" className={styles.directionImage} />
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Сервисное обслуживание</p>
                <p className={styles.directionText}>Профессиональные замеры и качественное обслуживание оборудования. Гарантируем долговечность и надежность ваших инвестиций.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
