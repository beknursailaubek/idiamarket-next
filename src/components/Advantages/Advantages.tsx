import Image from "next/image";
import styles from "./Advantages.module.css";

const Advantages = () => {
  return (
    <div className={styles.advantages}>
      <div className={styles.advantagesTitle}>Наши преимущества</div>
      <div className={styles.advantagesRow}>
        <div className={styles.advantage}>
          <div className={styles.advantageTitle}>Сервис</div>
          <div className={styles.advantageInner}>
            <Image className={styles.advantageImage} width={70} height={70} alt="" src="/images/icons/service-styled.png" />
            <div className={styles.advantageText}>безупречное сервисное обслуживание</div>
          </div>
        </div>

        <div className={styles.advantage}>
          <div className={styles.advantageTitle}>3D проект</div>
          <div className={styles.advantageInner}>
            <Image className={styles.advantageImage} width={70} height={70} alt="" src="/images/icons/3d-styled.png" />
            <div className={styles.advantageText}>дизайн-проект торгового пространства</div>
          </div>
        </div>

        <div className={styles.advantage}>
          <div className={styles.advantageTitle}>Гарантия</div>
          <div className={styles.advantageInner}>
            <Image className={styles.advantageImage} width={70} height={70} alt="" src="/images/icons/guarantee-styled.png" />
            <div className={styles.advantageText}>качества товара на всю продукцию</div>
          </div>
        </div>

        <div className={styles.advantage}>
          <div className={styles.advantageTitle}>Доставка</div>
          <div className={styles.advantageInner}>
            <Image className={styles.advantageImage} width={70} height={70} alt="" src="/images/icons/delivery-styled.png" />
            <div className={styles.advantageText}>осуществляется во все регионы РК</div>
          </div>
        </div>

        <div className={styles.advantage}>
          <div className={styles.advantageTitle}>Время</div>
          <div className={styles.advantageInner}>
            <Image className={styles.advantageImage} width={70} height={70} alt="" src="/images/icons/client-time-styled.png" />
            <div className={styles.advantageText}>бережное отношение ко времени Клиента</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
