"use client";
import { useState } from "react";
import Image from "next/image";
import { FaqData } from "@/types";
import styles from "./Faq.module.css";

const Faq = ({ data }: { data: FaqData }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleAnswer = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <div className={styles.faq} itemScope itemType="https://schema.org/FAQPage">
      {data.title && (
        <h2 className={styles.faqTitle} itemProp="name">
          {data.title}
        </h2>
      )}
      <ul className={styles.faqList}>
        {data.list.map((item, index) => (
          <li key={index} className={styles.faqItem} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <div className={styles.faqItemHeader} onClick={() => toggleAnswer(index)}>
              <h4 className={styles.faqQuestion} itemProp="name">
                {item.question}
              </h4>
              <Image src="/images/icons/arrow-down.svg" width={20} height={20} alt="" className={`${expandedItems.includes(index) ? styles.iconRotated : ""}`} />
            </div>
            <div className={`${styles.faqAnswer} ${expandedItems.includes(index) ? "" : styles.faqAnswerHidden}`} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text" dangerouslySetInnerHTML={{ __html: item.answer }}></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faq;
