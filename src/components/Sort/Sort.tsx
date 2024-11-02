// src/components/Sort/Sort.tsx
"use client";
import Image from "next/image";
import { useState, useRef, useEffect, FC } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Sort.module.css";

const Sort: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = searchParams.get("sort") || "popular";

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

  // Sort options with their corresponding keys
  const options: { label: string; value: string }[] = [
    { label: "По популярности", value: "popular" },
    { label: "По скидке", value: "discount" },
    { label: "По новизне", value: "created_at" },
    { label: "По возрастанию цены", value: "priceAsc" },
    { label: "По убыванию цены", value: "priceDesc" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: { label: string; value: string }) => {
    setIsOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get the label for the currently selected option
  const getSelectedLabel = () => {
    const currentOption = options.find((option) => option.value === selectedOption);
    return currentOption ? currentOption.label : "";
  };

  return (
    <div className={styles.sort} ref={sortRef}>
      <div className={styles.sortWrapper} onClick={toggleDropdown}>
        <Image className={styles.sortIcon} src="/images/icons/sort.svg" width={20} height={20} alt="" />
        {getSelectedLabel()}
        <Image className={styles.sortIconArrow} src={isOpen ? "/images/icons/arrow-up.svg" : "/images/icons/arrow-down.svg"} alt="" width={16} height={16} />
      </div>
      {isOpen && (
        <ul className={styles.sortOptions}>
          {options.map((option) => (
            <li key={option.value} onClick={() => handleOptionClick(option)} className={`${styles.sortOption} ${option.value === selectedOption ? styles.sortOptionSelected : ""}`}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sort;
