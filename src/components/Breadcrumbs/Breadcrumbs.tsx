"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CityContext } from "@/context/CityContext";
import styles from "./Breadcrumbs.module.css";

interface Breadcrumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  onBreadcrumbClick?: (breadcrumb: Breadcrumb) => void;
  code?: string;
  productName?: string;
}

const fetchBreadcrumbsData = async (code: string, selectedCityUri: string, category_code: string): Promise<Breadcrumb[]> => {
  try {
    const response = await fetch(`${apiUrl}/breadcrumbs/${code || category_code}`);
    if (!response.ok) {
      throw new Error("Failed to fetch breadcrumbs");
    }
    const data: Breadcrumb[] = await response.json();

    const homeBreadcrumb: Breadcrumb = {
      name: "Главная",
      path: selectedCityUri ? `/${selectedCityUri}` : "/",
    };

    return [homeBreadcrumb, ...data];
  } catch (error) {
    console.error("Error fetching breadcrumbs:", error);
    return [];
  }
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ onBreadcrumbClick, code, productName }) => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const { selectedCity } = useContext(CityContext) || {};
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !selectedCity) return;
    const pathnames = pathname.split("/").filter((x) => x);
    const categoryCode = code || pathnames[pathnames.length - 1];

    const fetchAndSetBreadcrumbs = async () => {
      const data = await fetchBreadcrumbsData(categoryCode, selectedCity.uri, categoryCode);

      if (productName) {
        data.push({
          name: productName,
          path: pathname,
        });
      }

      setBreadcrumbs(data);
    };

    fetchAndSetBreadcrumbs();
  }, [isClient, selectedCity?.uri, code, productName, pathname]);

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(breadcrumb);
    }
  };

  if (!isClient) return null;

  return (
    <nav className={styles.breadcrumbs}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return isLast ? (
          <span key={breadcrumb.path} className={styles.breadcrumb}>
            {breadcrumb.name}
          </span>
        ) : (
          <React.Fragment key={breadcrumb.path}>
            <Link href={breadcrumb.path}>
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
