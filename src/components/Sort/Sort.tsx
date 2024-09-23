"use client";
import Image from "next/image";
import { useState, useRef, useEffect, FC } from "react";
import styles from "./Sort.module.css";

interface SortProps {
  onSortChange: (option: string) => void;
}

const Sort: FC<SortProps> = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>("По популярности");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const options: string[] = ["По популярности", "По скидке", "По новизне", "По возрастанию цены", "По убыванию цены"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSortChange(option);
  };

  return (
    <div className={styles.sort} ref={sortRef}>
      <div className={styles.sortWrapper} onClick={toggleDropdown}>
        <Image className={styles.sortIcon} src="/images/icons/sort.svg" width={16} height={16} alt="" />
        {selectedOption}
        <Image className={styles.sortIconArrow} src={isOpen ? "/images/icons/arrow-up.svg" : "/images/icons/arrow-down.svg"} alt="" width={16} height={16} />
      </div>
      {isOpen && (
        <ul className={styles.sortOptions}>
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)} className={`${styles.sortOption} ${option === selectedOption ? styles.sortOptionSelected : ""}`}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sort;
