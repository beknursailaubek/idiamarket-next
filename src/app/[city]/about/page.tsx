import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Advantages from "@/components/Advantages/Advantages";
import AboutSlider from "@/components/AboutSlider/AboutSlider";
import React, { useRef, useState } from "react";

import styles from "./About.module.css";
import Image from "next/image";

export function generateMetadata({ params }: { params: { city: string } }) {
  const { city } = params;

  return {
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${city}/about`,
    },
  };
}

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
          <AboutSlider />

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
                    <p className={styles.resultTitle}>10 000 +</p>
                    <p className={styles.resultText}>товаров в ассортименте</p>
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
                <p className={styles.directionTitle}>Замер</p>
                <p className={styles.directionText}>Выезд специалиста для проведения точных замеров, необходимых для подбора и установки оборудования.</p>
              </div>
              <Image src="/images/about/3d.jpg" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/3d.jpg" width={500} height={450} alt="" className={styles.directionImage} />
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>3D Проектирование</p>
                <p className={styles.directionText}>Наши проект-менеджеры помогут продумать заранее, как будет выглядеть ваше торговое пространство, и вы сможете внести любые правки на этапе проектирования.</p>
              </div>
            </div>

            <div className={styles.direction}>
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Оснащение</p>
                <p className={styles.directionText}>Комплексный процесс, включающий подбор и установку специализированного оборудования, оптимально подходящего для вашего бизнеса.</p>
              </div>
              <Image src="/images/about/equipment.jpeg" width={500} height={450} alt="" className={styles.directionImage} />
            </div>

            <div className={styles.direction}>
              <Image src="/images/about/service.webp" width={1000} height={450} alt="" className={styles.directionImage} />
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Доставка</p>
                <p className={styles.directionText}>У нас свой автопарк и оптимизированные логистические процессы. Доставка в черте города Бесплатно. Товар будет привезен точно в согласованный день и выбранное вами время по указанному адресу.</p>
              </div>
            </div>

            <div className={styles.direction}>
              <div className={styles.directionContent}>
                <p className={styles.directionTitle}>Сервисное обслуживание</p>
                <p className={styles.directionText}>Наши высококвалифицированные специалисты оперативно и точно соберут и сделают установку оборудования любой сложности, обеспечив их устойчивость и соответствие стандартам безопасности.</p>
              </div>
              <Image src="/images/about/sklad.jpg" width={500} height={450} alt="" className={styles.directionImage} />
            </div>
          </div>

          <Advantages />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
