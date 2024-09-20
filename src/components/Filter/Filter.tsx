import styles from "./Filter.module.css";

const Filter = () => {
  return (
    <div className={styles.filter}>
      <div className={styles.filterBody}>
        <div className={""}>
          <label htmlFor="price" className={styles.filterTitle}>
            Цена (₸)
          </label>
          <div className={styles.filterBars}>
            <div className={styles.filterBar}>
              <label className={styles.filterBarLabel} htmlFor="minPrice">
                От
              </label>
              <input className={styles.filterBarInput} type="text" id="minPrice" name="minPrice" />
            </div>
            <span className={styles.filterBarDevider}>-</span>
            <div className={styles.filterBar}>
              <label className={styles.filterBarLabel} htmlFor="maxPrice">
                До
              </label>
              <input className={styles.filterBarInput} type="text" id="maxPrice" name="maxPrice" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
