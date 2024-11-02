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
  page?: string;
}

const customBreadcrumbs: Breadcrumb[] = [
  { name: "Контакты", path: "/contacts" },
  { name: "О нас", path: "/about" },
  { name: "Поиск", path: "/search" },
];

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

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ onBreadcrumbClick, code, productName, page }) => {
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

      // Проверяем наличие page и сравниваем с customBreadcrumbs
      if (page) {
        const matchedCustomBreadcrumb = customBreadcrumbs.find((crumb) => crumb.path === `/${page}`);
        if (matchedCustomBreadcrumb) {
          data.push({
            name: matchedCustomBreadcrumb.name,
            path: buildUrl(matchedCustomBreadcrumb.path),
          });
        }
      }

      setBreadcrumbs(data);
    };

    fetchAndSetBreadcrumbs();
  }, [code, productName, pathname, page]);

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(breadcrumb);
    }
  };

  return (
    <ul className={styles.breadcrumbs} aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
      {breadcrumbs.map((breadcrumb, index) => {
        const breadcrumbUrl = buildUrl(breadcrumb.path);

        return (
          <li key={index} className={styles.breadcrumbsItem} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={breadcrumbUrl} className={styles.breadcrumb} onClick={() => handleBreadcrumbClick(breadcrumb)} itemProp="item" role="link" aria-label={`${breadcrumb.name}`}>
              <span itemProp="name">{breadcrumb.name}</span>
            </Link>
            <meta itemProp="position" content={(index + 1).toString()} />
            {index < breadcrumbs.length - 1 && (
              <span className={styles.breadcrumbIcon} aria-hidden="true">
                /
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
