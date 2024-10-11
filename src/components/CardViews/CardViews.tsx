import { useState, useEffect } from "react";
import styles from "./CardViews.module.css";
import Image from "next/image";

const CardViews = () => {
  const [activeView, setActiveView] = useState("card");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleView = (view: string) => {
    setActiveView(view);
  };

  return (
    <div className={styles.views}>
      {isMobile ? (
        <>
          {activeView === "card" ? (
            <div className={`${styles.view} ${styles.viewList}`} onClick={() => toggleView("list")}>
              <Image className={styles.viewImage} src="/images/icons/view-list.svg" alt="List View" width={18} height={18} />
            </div>
          ) : (
            <div className={`${styles.view} ${styles.viewCard}`} onClick={() => toggleView("card")}>
              <Image className={styles.viewImage} src="/images/icons/view-card.svg" alt="Card View" width={18} height={18} />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={`${styles.view} ${styles.viewCard} ${activeView === "card" ? styles.viewActive : ""}`} onClick={() => toggleView("card")}>
            <Image className={styles.viewImage} src="/images/icons/view-card.svg" alt="Card View" width={18} height={18} />
          </div>

          <div className={`${styles.view} ${styles.viewList} ${activeView === "list" ? styles.viewActive : ""}`} onClick={() => toggleView("list")}>
            <Image className={styles.viewImage} src="/images/icons/view-list.svg" alt="List View" width={18} height={18} />
          </div>
        </>
      )}
    </div>
  );
};

export default CardViews;
