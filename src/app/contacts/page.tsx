import Link from "next/link";
import Image from "next/image";
import styles from "./Contact.module.css";

const ContactPage = () => {
  const currentYear = new Date().getFullYear();
  const yearsInMarket = currentYear - 2010;

  return (
    <div className="container">
      <div className={styles.body}>
        <h1 className="title">Контакты</h1>
        <p className={styles.about}>IDIA Market — лидер на рынке складского, архивного и торгово-выставочного оборудования, а также поставщик холодильного и торгового оборудования в Казахстане. Компания предлагает современное торговое и POS-оборудование, внедряет комплексные решения по автоматизации бизнеса и работает на рынке уже {yearsInMarket} лет.</p>

        <div className={styles.cities}>
          <div className={styles.city}>
            <div className={styles.info}>
              <p className={styles.cityName}>Алматы</p>

              <div className={styles.address}>
                <p className={styles.label}>Адрес</p>
                <p className={styles.addressInfo}>г. Алматы, 050008, ул. Мынбаева 43 (уг.ул. Манаса)</p>
              </div>

              <div className={styles.schedule}>
                <p className={styles.label}>Время работы</p>
                <div className={styles.scheduleInfo}>
                  <p>пн-пт с 9:00 до 18:00</p>
                  <p>сб с 9:00 до 16:00</p>
                </div>
              </div>

              <div className={styles.phone}>
                <p className={styles.label}>Телефон</p>

                <div className={styles.phoneInfos}>
                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87012667700">
                    +7 (701) 266-77-00
                  </Link>

                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87273449900">
                    8 (727) 344-99-00
                  </Link>
                </div>
              </div>

              <div className={styles.email}>
                <p className={styles.label}>Электронная почта</p>

                <Link className={`${styles.link} ${styles.emailInfo}`} href="mailto:zakaz@idiamarket.kz">
                  zakaz@idiamarket.kz
                </Link>
              </div>
            </div>

            <div className={styles.map}></div>
          </div>

          <div className={styles.city}>
            <div className={styles.info}>
              <p className={styles.cityName}>Астана</p>

              <div className={styles.address}>
                <p className={styles.label}>Адрес</p>
                <p className={styles.addressInfo}>г. Астана, 010000, ул. Бейсекбаева 24/1, 2-этаж, бизнес центр DARA</p>
              </div>

              <div className={styles.schedule}>
                <p className={styles.label}>Время работы</p>
                <div className={styles.scheduleInfo}>
                  <p>пн-пт с 9:00 до 18:00</p>
                  <p>сб с 9:00 до 16:00</p>
                </div>
              </div>

              <div className={styles.phone}>
                <p className={styles.label}>Телефон</p>

                <div className={styles.phoneInfos}>
                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87015112200">
                    +7 (701) 511-22-00
                  </Link>

                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87172279900">
                    8 (7172) 27-99-00
                  </Link>
                </div>
              </div>

              <div className={styles.email}>
                <p className={styles.label}>Электронная почта</p>

                <Link className={`${styles.link} ${styles.emailInfo}`} href="mailto:zakaz@idiamarket.kz">
                  astana@idiamarket.kz
                </Link>
              </div>
            </div>

            <div className={styles.map}></div>
          </div>

          <div className={styles.city}>
            <div className={styles.info}>
              <p className={styles.cityName}>Шымкент</p>

              <div className={styles.address}>
                <p className={styles.label}>Адрес</p>
                <p className={styles.addressInfo}>г. Шымкент, ул. Мадели кожа 35/1, (уг.ул. Байтурсынова) 1-этаж, бизнес-центр BNK</p>
              </div>

              <div className={styles.schedule}>
                <p className={styles.label}>Время работы</p>
                <div className={styles.scheduleInfo}>
                  <p>пн-пт с 9:00 до 18:00</p>
                  <p>сб с 9:00 до 16:00</p>
                </div>
              </div>

              <div className={styles.phone}>
                <p className={styles.label}>Телефон</p>

                <div className={styles.phoneInfos}>
                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87012667700">
                    +7 (701) 266-77-00
                  </Link>

                  <Link className={`${styles.link} ${styles.phoneInfo}`} href="tel:87273449900">
                    8 (727) 344-99-00
                  </Link>
                </div>
              </div>

              <div className={styles.email}>
                <p className={styles.label}>Электронная почта</p>

                <Link className={`${styles.link} ${styles.emailInfo}`} href="mailto:zakaz@idiamarket.kz">
                  zakaz@idiamarket.kz
                </Link>
              </div>
            </div>

            <div className={styles.map}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
