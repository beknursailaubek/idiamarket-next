"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./Seo.module.css";
import { SeoData } from "@/types";

const Seo = ({ data }: { data: SeoData }) => {
  const [isAboutHidden, setIsAboutHidden] = useState(true);

  const toggleAboutHidden = () => {
    setIsAboutHidden(!isAboutHidden);
  };

  return (
    <div className={`${styles.seo}  ${isAboutHidden ? styles.seoInnerHidden : null}`}>
      <h2 className={styles.seoHeader}>{data.meta_header}</h2>
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
