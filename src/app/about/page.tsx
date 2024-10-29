"use client";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Advantages from "@/components/Advantages/Advantages";
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
      <div className="container">
        <Breadcrumbs page={"about"} />
      </div>

      <div className={styles.container}>
        <div className={styles.contentBox}>
          {/* Заголовок */}
          <h1 className={`${styles.title} title`}>О компании</h1>

          {/* Описание компании */}
          <div className={styles.desc}>
            <p className={styles.descTitle}>Компания IDIA Market является надежным партнером в области торгового, холодильного и складского оборудования в Казахстане. Мы специализируемся на предоставлении широкого ассортимента высококачественных товаров для бизнеса по доступным ценам.</p>
            <p className={styles.descText}>IDIA Market располагает развитой сетью доставки, охватывающей все регионы Казахстана, включая Алматы, Астану, Шымкент, Караганду, Тараз и другие города. Наша компания гордится высококвалифицированной командой специалистов и собственными сервисными центрами, обеспечивающими квалифицированное обслуживание и поддержку клиентов.</p>
          </div>

          {/* Слайдер */}
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
                <Image className={styles.slideImage} src="/images/about/slide1.png" width={1140} height={450} alt="" />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Статистика */}
          <div className={styles.results}>
            <h3 className={styles.resultsTitle}>«IDIA Market» сегодня</h3>

            <div className={styles.resultsItems}>
              <div className={styles.resultsRow}>
                <div className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>14</p>
                    <p className={styles.resultText}>лет на рынке</p>
                  </div>
                  <div className={styles.resultImage}>
                    <Image src="/images/icons/exp.svg" className={styles.resultIcon} width={48} height={48} alt="" />
                  </div>
                </div>

                <div className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>3</p>
                    <p className={styles.resultText}>филиала по Казахстану</p>
                  </div>
                  <div className={styles.resultImage}>
                    <Image src="/images/icons/branch.svg" className={styles.resultIcon} width={48} height={48} alt="" />
                  </div>
                </div>

                <div className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>3000 +</p>
                    <p className={styles.resultText}>товаров в наличии</p>
                  </div>
                  <div className={styles.resultImage}>
                    <Image src="/images/icons/clients.svg" className={styles.resultIcon} width={48} height={48} alt="" />
                  </div>
                </div>
              </div>

              <div className={styles.resultsRow}>
                <div className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>14 000 +</p>
                    <p className={styles.resultText}>довольных клиентов</p>
                  </div>
                  <div className={styles.resultImage}>
                    <Image src="/images/icons/products.svg" className={styles.resultIcon} width={48} height={48} alt="" />
                  </div>
                </div>
                <div className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>27 000 +</p>
                    <p className={styles.resultText}>успешно выполненных проектов</p>
                  </div>
                  <div className={styles.resultImage}>
                    <Image src="/images/icons/projects.svg" className={styles.resultIcon} width={48} height={48} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Основные направления */}
          <div className={styles.directions}>
            <h3 className={styles.directionsTitle}>Основные направления деятельности компании</h3>

            <div className={styles.direction}>
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>3D Проектирование</p>
                <p className={styles.directionText}>Создаем удобные и привлекательные 3D проекты любой уровни сложности. Бесплатная визуализация помогает избежать ошибок при реализации.</p>
              </div>
              <Image src="/images/about/3d.jpg" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/equipment.jpeg" width={500} height={450} alt="" className={styles.directionImage} />
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
              <Image src="/images/about/sklad.jpg" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/service.webp" width={1000} height={450} alt="" className={styles.directionImage} />
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Сервисное обслуживание</p>
                <p className={styles.directionText}>Профессиональные замеры и качественное обслуживание оборудования. Гарантируем долговечность и надежность ваших инвестиций.</p>
              </div>
            </div>
          </div>

          <Advantages />

          <div className={styles.clients}></div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
