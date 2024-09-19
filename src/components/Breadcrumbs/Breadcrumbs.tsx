import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet";
import { CityContext } from "../../context/CityContext"; // Adjust the path based on your project structure
import styles from "./Breadcrumbs.module.css"; // Assuming you're using CSS modules for styles

interface Breadcrumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  onBreadcrumbClick?: (breadcrumb: Breadcrumb) => void;
  code?: string;
  productName?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ onBreadcrumbClick, code, productName }) => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const { selectedCity } = useContext(CityContext);

  useEffect(() => {
    const pathnames = router.asPath.split("/").filter((x) => x);
    const category_code = pathnames[pathnames.length - 1];

    const fetchBreadcrumbs = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/product/breadcrumbs/${code || category_code}`);
        if (!response.ok) throw new Error("Failed to fetch breadcrumbs");
        const data: Breadcrumb[] = await response.json();

        const homeBreadcrumb: Breadcrumb = {
          name: "Главная",
          path: selectedCity.uri ? `/${selectedCity.uri}` : "/",
        };

        let allBreadcrumbs = [homeBreadcrumb, ...data];

        if (productName) {
          allBreadcrumbs = [
            ...allBreadcrumbs,
            {
              name: productName,
              path: router.asPath,
            },
          ];
        }

        setBreadcrumbs(allBreadcrumbs);
      } catch (error) {
        console.error("Error fetching breadcrumbs:", error);
      }
    };

    fetchBreadcrumbs();
  }, [router.asPath, selectedCity.uri, code, productName]);

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(breadcrumb);
    }
  };

  const generateStructuredData = () => {
    const itemListElement = breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `${window.location.origin}${breadcrumb.path}`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };
  };

  return (
    <>
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
                <a className={styles.breadcrumb} onClick={() => handleBreadcrumbClick(breadcrumb)}>
                  {breadcrumb.name}
                </a>
              </Link>
              <div className={styles.breadcrumb__icon}>/</div>
            </React.Fragment>
          );
        })}
      </nav>

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(generateStructuredData())}</script>
      </Helmet>
    </>
  );
};

export default Breadcrumbs;
