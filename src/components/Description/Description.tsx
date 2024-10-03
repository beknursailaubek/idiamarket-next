"use client";
import React, { useState } from "react";
import styles from "./Description.module.css";
import Image from "next/image";

const Description = ({ content }: { content: string | null }) => {
  const [isDescriptionHidden, setIsDescriptionHidden] = useState(true);

  const toggleAttributesHidden = () => {
    setIsDescriptionHidden(!isDescriptionHidden);
  };

  return (
    <div className={`${styles.description} ${isDescriptionHidden ? styles.descriptionHidden : null}`}>
      <h2 className={`title ${styles.descriptionTitle}`}>Описание</h2>

      <div className={styles.descriptionContent} dangerouslySetInnerHTML={{ __html: content || "Описание не доступно" }}></div>

      <div className={styles.descriptionHide}>
        <div className={styles.descriptionBtn} onClick={toggleAttributesHidden}>
          <p className={styles.descriptionBtnText}>{isDescriptionHidden ? "Читать полностью" : "Скрыть описание"}</p>
          <Image className={styles.descriptionBtnImg} src={isDescriptionHidden ? "/images/icons/arrow-down.svg" : "/images/icons/arrow-up.svg"} width={20} height={20} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Description;
