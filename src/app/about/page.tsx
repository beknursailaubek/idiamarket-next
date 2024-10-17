import styles from "./About.module.css";

const AboutPage = () => {
  return (
    <div className={styles.body}>
      <div className={`container`}>
        <div className={styles.contentBox}>
          {/* Баннер */}
          <div className={styles.banner}>
            <h1 className={styles.bannerTitle}>Интернет-магазин IDIA Market</h1>
          </div>

          {/* Описание компании */}
          <section className={styles.textSection}>
            <p className={styles.text}>IDIA Market — это ваш надежный партнер в области торгового, холодильного и складского оборудования в Казахстане. Мы предлагаем широкий ассортимент товаров высокого качества для бизнеса по доступным ценам.</p>
            <p className={styles.text}>В нашем каталоге представлены торговые стеллажи, холодильные установки, оборудование для общепита, POS-системы, металлические шкафы и многое другое. Мы работаем с лучшими мировыми брендами и доставляем наши товары по всему Казахстану: Алматы, Астана, Шымкент, Караганда, Тараз и другие города.</p>
          </section>

          {/* Карточки с преимуществами */}
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>14</h2>
              <p className={styles.cardText}>Лет на рынке</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>27000+</h2>
              <p className={styles.cardText}>Успешных проектов</p>
            </div>
            <div className={styles.card}> 
              <h2 className={styles.cardTitle}>100%</h2>
              <p className={styles.cardText}>Качество и надежность</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>24/7</h2>
              <p className={styles.cardText}>Поддержка клиентов</p>
            </div>
          </div>

          {/* Ассортимент продукции */}
          <section className="mt-10">
            <h2 className={styles.sectionTitle}>Что мы предлагаем?</h2>
            <ul className={styles.list}>
              <li>Торговое оборудование и стеллажи</li>
              <li>Холодильные установки и оборудование для общепита</li>
              <li>POS-системы и кассовые боксы</li>
              <li>Складские стеллажи и металлические шкафы</li>
              <li>Оборудование для аптек и коммерческая мебель</li>
              <li>Нейтральное оборудование и витрины</li>
            </ul>
          </section>

          {/* Условия доставки и заказа */}
          <section className="mt-10">
            <h2 className={styles.sectionTitle}>Доставка и заказ</h2>
            <p className={styles.text}>Мы доставляем товары по всему Казахстану, включая отдаленные регионы. Вы можете выбрать доставку до двери или самовывоз из наших пунктов выдачи. Стоимость доставки рассчитывается автоматически при оформлении заказа и зависит от объема и региона.</p>
            <p className={styles.text}>Оформить заказ легко: выберите нужный товар, добавьте его в корзину и следуйте инструкциям на сайте. Мы свяжемся с вами для подтверждения и уточнения деталей.</p>
          </section>

          {/* Контактная информация */}
          <section className="mt-10">
            <h2 className={styles.sectionTitle}>Свяжитесь с нами</h2>
            <p className={styles.text}>
              Посетите наш сайт:{" "}
              <a href="#" className={styles.contactLink}>
                idiamarket.kz
              </a>
            </p>
            <p className={styles.text}>
              Свяжитесь с нами по телефону:{" "}
              <a href="tel:+77171717171" className={styles.contactLink}>
                +7 (717) 171-71-71
              </a>
            </p>
            <p className={styles.text}>Мы всегда рады вам помочь!</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
