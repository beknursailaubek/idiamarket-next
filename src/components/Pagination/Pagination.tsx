"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));

      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`${styles.pageButton} ${i === currentPage ? styles.active : ""}`}>
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={styles.pagination}>
      {/* <button onClick={() => handlePageChange(currentPage - 1)} className={styles.pageArrow} disabled={currentPage === 1}>
        &larr;
      </button> */}
      {renderPageNumbers()}
      {/* <button onClick={() => handlePageChange(currentPage + 1)} className={styles.pageArrow} disabled={currentPage === totalPages}>
        &rarr;
      </button> */}
    </div>
  );
};

export default Pagination;
