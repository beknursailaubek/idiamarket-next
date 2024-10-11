import Link from "next/link";
import styles from "./Contact.module.css";

const ContactPage = () => {
  return (
    <div className="container">
      <div className={styles.body}>
        <h1 className="title">Контакты</h1>
        <p className={styles.about}>IDIA Market является ведущим производителем складского, архивного и торгово-выставочного оборудования, имеет твердые позиции и занимает лидирующее положение на рынке металлической мебели. "IDIA Market" является успешным поставщиком ведущих производителей холодильного и торгового оборудования в Республике Казахстан. Компания предлагает современное торговое и POS оборудование. "IDIA Market" осуществляет не только продажу, но и комплексное внедрение автоматизации бизнеса. Производственная база компании позволяет выпускать оборудование в больших объемах, и вместе с тем совершенствовать изо дня в день свою продукцию, предлагать широкий спектр конструкций, моделей и цветов. Четкое планирование, высокая производительность, технологичность и возможность программирования систем позволяют выпускать продукцию высочайшего качества.</p>

        <div className={styles.city}>
          <div className={styles.info}>
            <p className={styles.cityName}>г. Алматы, 050008, ул. Мынбаева 43 (уг.ул. Манаса)</p>
            <Link className={`${styles.link} ${styles.email}`} href="mailto:zakaz@idiamarket.kz">
              zakaz@idiamarket.kz
            </Link>
            <Link className={`${styles.link} ${styles.phone}`} href="tel:87273449900">
              8 (727) 344-99-00
            </Link>
            <Link className={`${styles.link} ${styles.phone}`} href="tel:87012667700">
              +7 (701) 266-77-00
            </Link>
          </div>

          <div className={styles.map}></div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
