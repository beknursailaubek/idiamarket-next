// Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Clone existing search parameters
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(i)); // Update the 'page' parameter

      // Construct the new href with updated 'page' parameter
      const href = `${pathname}?${params.toString()}`;

      pages.push(
        <Link href={href} key={i} className={`${styles.pageButton} ${i === currentPage ? styles.active : ""}`} aria-current={i === currentPage ? "page" : undefined}>
          {i}
        </Link>
      );
    }
    return pages;
  };

  return <div className={styles.pagination}>{renderPageNumbers()}</div>;
};

export default Pagination;
