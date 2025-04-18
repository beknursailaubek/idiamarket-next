"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./Seo.module.css";
import { SeoMetadata } from "@/types";

const Seo = ({ data }: { data: SeoMetadata }) => {
  const [isAboutHidden, setIsAboutHidden] = useState(true);

  const toggleAboutHidden = () => {
    setIsAboutHidden(!isAboutHidden);
  };

  return (
    <div className={`${styles.seo}  ${isAboutHidden ? styles.seoInnerHidden : null}`}>
      <h2 className={styles.seoHeader}>{data.seo_header}</h2>
      <div className={`${styles.seoText}`} dangerouslySetInnerHTML={{ __html: data.seo_text }}></div>
      <div className={styles.seoHide}>
        <div className={styles.seoBtn} onClick={toggleAboutHidden}>
          <p className={styles.seoBtnText}>{isAboutHidden ? "Читать далее" : "Скрыть"}</p>
        </div>
      </div>
    </div>
  );
};

export default Seo;
