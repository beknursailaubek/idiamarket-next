"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./Attributes.module.css";

type AttributeItem = {
  title: string;
  value: string;
};

type AttributeGroup = {
  title: string;
  items: AttributeItem[];
};

type AttributesProps = {
  attributes: AttributeGroup[];
};

const Attributes: React.FC<AttributesProps> = ({ attributes }) => {
  const [isAttributesHidden, setIsAttributesHidden] = useState(true);

  const toggleAttributesHidden = () => {
    setIsAttributesHidden(!isAttributesHidden);
  };

  return (
    <div className={styles.attributes}>
      <h2 className="title">Характеристики</h2>

      <div className={styles.attributesList}>
        {attributes && attributes.length > 0
          ? attributes.map((group, index) => (
              <div key={index} className={styles.attributesGroup}>
                <p className={styles.attributesGroupTitle}>{group.title}</p>

                {group.items && group.items.length > 0 ? (
                  <ul className={styles.attributesItems}>
                    {Object.entries(
                      group.items.reduce<Record<string, string[]>>((acc, item) => {
                        // Group by title
                        if (!acc[item.title]) {
                          acc[item.title] = [];
                        }
                        acc[item.title].push(item.value); // Collect values
                        return acc;
                      }, {})
                    ).map(([title, values], idx: number) => (
                      <li key={idx} className={styles.attribute}>
                        <span className={styles.attributeTitle}>{title}</span>
                        <span className={styles.attributeValue}>{values.join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          : null}
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

export default Attributes;
