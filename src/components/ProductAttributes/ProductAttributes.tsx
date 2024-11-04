"use client";
import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import styles from "./ProductAttributes.module.css";
import { Attributes } from "@/types";

interface AttributesProps {
  attributes: Attributes[];
}

const ProductAttributes = ({ attributes }: AttributesProps) => {
  const [isAttributesHidden, setIsAttributesHidden] = useState(true);

  const toggleAttributesHidden = () => {
    setIsAttributesHidden(!isAttributesHidden);
  };

  const filteredAttributes = useMemo(() => {
    return attributes.filter((item) => item.is_active).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [attributes]);

  return (
    <div className={`${styles.attributes} ${isAttributesHidden ? styles.attributesHidden : ""}`}>
      <h2 className={`title ${styles.title}`}>Характеристики</h2>

      <div className={styles.attributesList}>
        {filteredAttributes.length > 0 &&
          filteredAttributes.map((group, index) => (
            <div key={index} className={styles.attributesGroup}>
              <p className={styles.attributesGroupTitle}>{group.title}</p>

              {group.items && group.items.length > 0 && (
                <ul className={styles.attributesItems}>
                  {Object.entries(
                    group.items
                      .filter((item) => item.is_active)
                      .reduce<Record<string, string[]>>((acc, item) => {
                        if (!acc[item.title]) {
                          acc[item.title] = [];
                        }
                        acc[item.title].push(item.value);
                        return acc;
                      }, {})
                  ).map(([title, values], idx) => (
                    <li key={idx} className={styles.attribute}>
                      <span className={styles.attributeTitle}>{title}</span>
                      <span className={styles.attributeValue}>{values.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>

      <div className={styles.attributesHide}>
        <div className={styles.attributesBtn} onClick={toggleAttributesHidden}>
          <p className={styles.attributesBtnText}>{isAttributesHidden ? "Раскрыть весь список" : "Скрыть список"}</p>
          <Image className={styles.attributesBtnImg} src={isAttributesHidden ? "/images/icons/arrow-down.svg" : "/images/icons/arrow-up.svg"} width={20} height={20} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ProductAttributes;
