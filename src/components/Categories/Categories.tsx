import Link from "next/link";
import Image from "next/image";
import styles from "./Categories.module.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getCategoryCounts(): Promise<Record<string, number>> {
  const categoryCodes = ["torgovye-stellazhi", "palletnye-stellazhi", "skladskie-stellazhi", "metallicheskie-shkafy", "oborudovanie-dlya-aptek", "nejtralnoe-oborudovanie", "vitriny"];

  const res = await fetch(`${apiUrl}/categories/count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category_codes: categoryCodes }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export default async function Categories() {
  const categoryCounts = await getCategoryCounts();

  return (
    <section>
      <div className={styles.container}>
        <p className={`title ${styles.title}`}>Категории</p>

        <div className={styles.categoriesBox}>
          <div className={styles.categoryGroupLeft}>
            <Link href={`/category/metallicheskie-stellazhi/torgovye-stellazhi`} className={`${styles.category} ${styles.torgovyeStellazhi}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["torgovye-stellazhi"] || 79}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/torgovye-stellazhi.png" alt="Торговые стеллажи" width={142} height={275} />
              <p className={styles.categoryTitle}>Торговые стеллажи</p>
            </Link>
            <Link href="" className={`${styles.category} ${styles.categoryMd} ${styles.kommercheskayaMebel}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["kommercheskaya-mebel"] || 6}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/kommercheskaya-mebel.png" alt="Коммерческая мебель" width={170} height={133} />
              <p className={styles.categoryTitle}>Коммерческая мебель</p>
            </Link>
            <Link href="" className={`${styles.category}   ${styles.categorySm} ${styles.kassovyeBoksy}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["kassovye-boksy"] || 77}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/kassovye-boksy.png" alt="Кассовые боксы" width={170} height={133} />
              <p className={styles.categoryTitle}>Кассовые боксы</p>
            </Link>
            <Link href="" className={`${styles.category}  ${styles.categorySm} ${styles.palletnyeStellazhi}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["palletnye-stellazhi"] || 4}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/palletnye-stellazhi.png" alt="Паллетные стеллажи" width={170} height={133} />
              <p className={styles.categoryTitle}>Паллетные стеллажи</p>
            </Link>
            <Link href={`/category/skladskie-stellazhi`} className={`${styles.category} ${styles.skladskieStellazhi}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["skladskie-stellazhi"] || 9}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/skladskie-stellazhi.png" alt="Складские стеллажи" width={170} height={133} />
              <p className={styles.categoryTitle}>Складские стеллажи</p>
            </Link>
            <Link href="" className={`${styles.category} ${styles.torgovoeOborudovanie}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["torgovoe-oborudovanie"] || 154}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/torgovoe-oborudovanie.png" alt="Торговое оборудование" width={345} height={192} />
              <p className={styles.categoryTitle}>Торговое оборудование</p>
            </Link>
          </div>

          <div className={styles.categoryGroupRight}>
            <Link href="" className={`${styles.category} ${styles.holodilnoeOborudovanie}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["holodilnoe-oborudovanie"] || 416}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/holodilnoe-oborudovanie.png" alt="Холодильное оборудование" width={234} height={109} />
              <p className={styles.categoryTitle}>Холодильное оборудование</p>
            </Link>

            <Link href="" className={`${styles.category}  ${styles.categoryMd} ${styles.posOborudovanie}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["pos-oborudovanie"] || 135}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/pos-oborudovanie.png" alt="POS оборудование" width={170} height={133} />
              <p className={styles.categoryTitle}>POS оборудование</p>
            </Link>

            <Link href="" className={`${styles.category}  ${styles.categoryMd} ${styles.vitriny}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["vitriny"] || 29}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/vitriny.png" alt="Витрины" width={170} height={133} />
              <p className={styles.categoryTitle}>Витрины </p>
            </Link>

            <Link href="" className={`${styles.category} ${styles.metallicheskieShkafy}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["metallicheskie-shkafy"] || 107}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/metallicheskie-shkafy.png" alt="Металлические шкафы" width={135} height={275} />
              <p className={styles.categoryTitle}>Металлические шкафы</p>
            </Link>

            <Link href="" className={`${styles.category}  ${styles.categorySm} ${styles.oborudovanieDlyaAptek}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["oborudovanie-dlya-aptek"] || 6}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/oborudovanie-dlya-aptek.png" alt="Оборудование для аптек" width={102} height={84} />
              <p className={styles.categoryTitle}>Оборудование для аптек</p>
            </Link>

            <Link href="" className={`${styles.category} ${styles.nejtralnoeOborudovanie}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["nejtralnoe-oborudovanie"] || 253}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/nejtralnoe-oborudovanie.png" alt="Нейтральное оборудование" width={160} height={192} />
              <p className={styles.categoryTitle}>Нейтральное оборудование</p>
            </Link>

            <Link href="" className={`${styles.category}  ${styles.categorySm} ${styles.oborudovanieDlyaObshepita}`}>
              <span className={styles.categoryCount}>Товаров: {categoryCounts["oborudovanie-dlya-obshepita"] || 659}</span>
              <Image loading="lazy" className={styles.categoryImage} src="/images/categories/oborudovanie-dlya-obshepita.png" alt="Оборудование для общепита" width={146} height={84} />
              <p className={styles.categoryTitle}>Оборудование для общепита</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
