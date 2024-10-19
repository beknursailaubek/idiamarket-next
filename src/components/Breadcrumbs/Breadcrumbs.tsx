"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCityContext } from "@/hooks/useCityContext";
import styles from "./Breadcrumbs.module.css";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface Breadcrumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  onBreadcrumbClick?: (breadcrumb: Breadcrumb) => void;
  code?: string;
  productName?: string;
}

const fetchBreadcrumbsData = async (code: string, category_code: string): Promise<Breadcrumb[]> => {
  try {
    const response = await fetch(`${apiUrl}/breadcrumbs/${code || category_code}`);
    if (!response.ok) {
      throw new Error("Failed to fetch breadcrumbs");
    }
    const data: Breadcrumb[] = await response.json();

    const homeBreadcrumb: Breadcrumb = {
      name: "Главная",
      path: "/",
    };

    return [homeBreadcrumb, ...data];
  } catch (error) {
    console.error("Error fetching breadcrumbs:", error);
    return [];
  }
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ onBreadcrumbClick, code, productName }) => {
  const { selectedCity } = useCityContext();
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // Ensure the cityPrefix is sanitized to avoid double slashes
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  const buildUrl = (path: string) => {
    // Ensure no double slashes appear by joining paths properly
    return `${cityPrefix}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/+/g, "/");
  };

  useEffect(() => {
    const pathnames = pathname.split("/").filter((x) => x);
    const categoryCode = code || pathnames[pathnames.length - 1];

    const fetchAndSetBreadcrumbs = async () => {
      const data = await fetchBreadcrumbsData(categoryCode, categoryCode);

      if (productName) {
        data.push({
          name: productName,
          path: pathname,
        });
      }

      setBreadcrumbs(data);
    };

    fetchAndSetBreadcrumbs();
  }, [code, productName, pathname]);

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(breadcrumb);
    }
  };

  return (
    <nav className={styles.breadcrumbs}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const breadcrumbUrl = buildUrl(breadcrumb.path);

        return isLast ? (
          <span key={breadcrumbUrl} className={styles.breadcrumb}>
            {breadcrumb.name}
          </span>
        ) : (
          <React.Fragment key={breadcrumbUrl}>
            <Link href={breadcrumbUrl}>
              <span className={styles.breadcrumb} onClick={() => handleBreadcrumbClick(breadcrumb)}>
                {breadcrumb.name}
              </span>
            </Link>
            <div className={styles.breadcrumbIcon}>/</div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
