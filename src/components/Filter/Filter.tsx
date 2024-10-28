"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Filter.module.css";
import { FilterOptions, FilterValues, Color } from "@/types";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  filterOptions: FilterOptions;
  isFilterOpen: boolean;
  closeFilter: () => void;
}

interface SelectedFilter {
  label: string;
  type: "color" | "price" | "attribute";
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, filterOptions, isFilterOpen, closeFilter }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { priceRange = [0, 0], colors = [], attributes = [] } = filterOptions || {};

  const [minPrice, setMinPrice] = useState<number>(filterOptions?.priceRange?.[0] ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(filterOptions?.priceRange?.[1] ?? 0);

  const [tempMinPrice, setTempMinPrice] = useState<number>(filterOptions?.priceRange?.[0] ?? 0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(filterOptions?.priceRange?.[1] ?? 0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  const [showColors, setShowColors] = useState<boolean>(true);
  const [visibleAttributes, setVisibleAttributes] = useState<{ [key: string]: boolean }>(attributes?.reduce((acc, attr) => ({ ...acc, [attr.code]: true }), {}));

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const generateColorHref = (colorCode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentColors = params.getAll("colors");

    if (currentColors.includes(colorCode)) {
      params.delete("colors");
      currentColors.filter((color) => color !== colorCode).forEach((color) => params.append("colors", color));
    } else {
      params.append("colors", colorCode);
    }

    return `${pathname}?${params.toString()}`;
  };

  const generateAttributeHref = (attributeCode: string, valueCode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(attributeCode);

    if (currentValues.includes(valueCode)) {
      params.delete(attributeCode);
      currentValues.filter((value) => value !== valueCode).forEach((value) => params.append(attributeCode, value));
    } else {
      params.append(attributeCode, valueCode);
    }

    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    const currentColors = searchParams.getAll("colors");
    const newAttributes: Record<string, string[]> = {};

    attributes.forEach((attr) => {
      newAttributes[attr.code] = searchParams.getAll(attr.code);
    });

    setSelectedColors(currentColors);
    setSelectedAttributes(newAttributes);
  }, [searchParams]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isFilterOpen]);

  const toggleColors = () => setShowColors((prev) => !prev);

  const toggleAttribute = (code: string) => {
    setVisibleAttributes((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAttributeChange = (attributeCode: string, valueCode: string) => {
    setSelectedAttributes((prevAttributes) => {
      const attributeValues = prevAttributes[attributeCode] || [];

      const newValues = attributeValues.includes(valueCode) ? attributeValues.filter((val) => val !== valueCode) : [...attributeValues, valueCode];

      return {
        ...prevAttributes,
        [attributeCode]: newValues,
      };
    });

    updateSelectedFilters();
  };

  useEffect(() => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      colors: selectedColors,
      attributes: selectedAttributes,
    });
    updateSelectedFilters();
  }, [minPrice, maxPrice, selectedColors, selectedAttributes]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      setTempMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      setTempMaxPrice(value);
    }
  };

  const validatePrices = () => {
    let newMinPrice = tempMinPrice;
    let newMaxPrice = tempMaxPrice;

    if (newMinPrice < priceRange[0]) newMinPrice = priceRange[0];
    if (newMaxPrice > priceRange[1]) newMaxPrice = priceRange[1];
    if (newMinPrice > newMaxPrice) newMinPrice = newMaxPrice;

    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setTempMinPrice(newMinPrice);
    setTempMaxPrice(newMaxPrice);
  };

  const handleBlur = () => {
    validatePrices();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validatePrices();
    }
  };

  const handleColorChange = (color: Color) => {
    const newSelectedColors = selectedColors.includes(color.code) ? selectedColors.filter((c) => c !== color.code) : [...selectedColors, color.code];

    setSelectedColors(newSelectedColors as string[]);
  };

  const updateSelectedFilters = () => {
    const filters: SelectedFilter[] = [];

    if (priceRange && (tempMinPrice !== priceRange[0] || tempMaxPrice !== priceRange[1])) {
      filters.push({
        label: `Цена: от ${formatPrice(tempMinPrice)} до ${formatPrice(tempMaxPrice)}`,
        type: "price",
      });
    }

    selectedColors.forEach((colorCode) => {
      const color = colors.find((color) => color.code === colorCode);
      if (color) {
        filters.push({
          label: `Цвет: ${color.title}`,
          type: "color",
        });
      }
    });

    Object.keys(selectedAttributes).forEach((attributeCode) => {
      const attribute = attributes.find((attr) => attr.code === attributeCode);
      if (attribute) {
        const selectedValues = selectedAttributes[attributeCode];
        if (Array.isArray(selectedValues)) {
          selectedValues.forEach((value) => {
            filters.push({
              label: `${attribute.title}: ${value}`,
              type: "attribute",
            });
          });
        }
      }
    });

    setSelectedFilters(filters);
  };

  const removeFilter = (filter: SelectedFilter) => {
    if (filter.type !== "price") return;

    const params = new URLSearchParams(searchParams.toString());

    if (filter.type === "price") {
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
      setTempMinPrice(priceRange[0]);
      setTempMaxPrice(priceRange[1]);

      params.delete("minPrice");
      params.delete("maxPrice");
    }

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });

    updateSelectedFilters();
  };

  const clearAllFilters = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setTempMinPrice(priceRange[0]);
    setTempMaxPrice(priceRange[1]);

    const params = new URLSearchParams(searchParams.toString());

    const priceKeys = ["minPrice", "maxPrice"];

    priceKeys.forEach((key) => params.delete(key));

    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });

    updateSelectedFilters();
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getBaseUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    const filterKeys = ["minPrice", "maxPrice", "colors", ...attributes.map((attr) => attr.code)];

    filterKeys.forEach((key) => params.delete(key));

    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  const generateRemoveFilterHref = (filter: SelectedFilter): string => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter.type === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (filter.type === "color") {
      const colorTitle = filter.label.split(": ")[1];
      const colorToRemove = colors.find((color) => color.title === colorTitle);

      if (colorToRemove) {
        const currentColors = params.getAll("colors");
        params.delete("colors");
        const updatedColors = currentColors.filter((code) => code !== colorToRemove.code);
        updatedColors.forEach((color) => params.append("colors", color));
      }
    }

    if (filter.type === "attribute") {
      const [attributeTitle, attributeValue] = filter.label.split(": ");
      const attribute = attributes.find((attr) => attr.title === attributeTitle);

      if (attribute) {
        const currentValues = params.getAll(attribute.code);
        params.delete(attribute.code);
        const updatedValues = currentValues.filter((val) => val !== attributeValue);
        updatedValues.forEach((val) => params.append(attribute.code, val));
      }
    }

    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className={`${styles.filter} ${isFilterOpen ? styles.filterMobileActive : ""}`}>
      <div className={styles.filterMobileHeader}>
        <span className={styles.filterMobileTitle}>Фильтры</span>
        <Image onClick={closeFilter} className={styles.filterMobileClose} src="/images/icons/close.svg" width={20} height={20} alt="" />
      </div>

      <div className={styles.filterInner}>
        {/* Selected Filters Section */}
        {selectedFilters.length > 0 && (
          <div className={styles.selectedFilters}>
            <p className={styles.selectedFiltersTitle}>Вы выбрали:</p>
            <div className={styles.selectedFiltersItems}>
              {selectedFilters.map((filter, index) => (
                <Link
                  key={index}
                  href={generateRemoveFilterHref(filter)}
                  onClick={(e) => {
                    removeFilter(filter);
                  }}
                  className={styles.selectedFiltersRemove}
                >
                  {filter.label} <Image className={styles.selectedFiltersRemoveImage} src="/images/icons/close.svg" width={20} height={20} alt="Remove filter" />
                </Link>
              ))}
            </div>
            <Link
              href={getBaseUrl()}
              onClick={(e) => {
                clearAllFilters();
              }}
              className={styles.selectedFiltersReset}
            >
              Очистить все
            </Link>
          </div>
        )}
        <div className={styles.filterBody}>
          <div className={styles.filterSection}>
            <div className={styles.filterSectionHeader}>
              <label htmlFor="price" className={styles.filterTitle}>
                Цена (₸)
              </label>
            </div>
            <div className={styles.filterBars}>
              <div className={styles.filterBar}>
                <label className={styles.filterBarLabel} htmlFor="minPrice">
                  От
                </label>
                <input className={styles.filterBarInput} type="text" id="minPrice" value={formatPrice(tempMinPrice)} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleMinPriceChange} />
              </div>
              <span className={styles.filterBarDivider}>-</span>
              <div className={styles.filterBar}>
                <label className={styles.filterBarLabel} htmlFor="maxPrice">
                  До
                </label>
                <input className={styles.filterBarInput} type="text" id="maxPrice" value={formatPrice(tempMaxPrice)} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleMaxPriceChange} />
              </div>
            </div>
          </div>
          {colors && colors.length > 0 && (
            <div className={styles.filterSection}>
              <div className={styles.filterSectionHeader} onClick={toggleColors}>
                <label className={styles.filterTitle}>Цвет</label>
                <Image className={styles.filterToggleButton} src={showColors ? "/images/icons/arrow-up.svg" : "/images/icons/arrow-down.svg"} width={20} height={20} alt="" />
              </div>
              <div className={`${styles.filterColors} ${styles.filterValues} ${colors.length > 4 && !expandedSections["color"] ? styles.filterValuesHidden : ""}`}>
                {showColors && (
                  <div className={`${styles.filterColors} ${styles.filterValues} ${colors.length > 4 && !expandedSections["color"] ? styles.filterValuesHidden : ""}`}>
                    {colors.slice(0, expandedSections["color"] ? colors.length : 4).map((color) => (
                      <Link href={generateColorHref(color.code)} key={color.code} className={`${styles.filterColor} ${selectedColors.includes(color.code) ? styles.filterColorActive : ""}`}>
                        <input type="checkbox" value={color.code} onChange={() => handleColorChange(color)} checked={selectedColors.includes(color.code)} />
                        <span className={styles.filterColorPalette} style={{ backgroundColor: color.hex }}></span>
                        <span className={styles.filterColorLabel}>{color.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {colors.length > 4 && (
                <button className={styles.toggleButton} onClick={() => toggleSection("color")}>
                  {expandedSections["color"] ? "Скрыть" : "Показать все"}
                </button>
              )}
            </div>
          )}
          {attributes?.map((attribute, index) => (
            <div key={`${attribute.title}-${index}`} className={styles.filterSection}>
              <div className={styles.filterSectionHeader} onClick={() => toggleAttribute(attribute.code)}>
                <label className={styles.filterTitle}>{attribute.title}</label>
                <Image className={styles.filterToggleButton} src={visibleAttributes[attribute.code] ? "/images/icons/arrow-up.svg" : "/images/icons/arrow-down.svg"} width={20} height={20} alt="" />
              </div>
              <div className={`${styles.filterAttributes} ${styles.filterValues} ${attribute.values.length > 4 && !expandedSections[attribute.code] ? styles.filterValuesHidden : ""}`}>
                {visibleAttributes[attribute.code] && (
                  <div className={`${styles.filterAttributes} ${styles.filterValues} ${attribute.values.length > 4 && !expandedSections[attribute.code] ? styles.filterValuesHidden : ""}`}>
                    {attribute.values.slice(0, expandedSections[attribute.code] ? attribute.values.length : 4).map((value) => (
                      <Link href={generateAttributeHref(attribute.code, value)} key={value} className={`${styles.filterAttribute} ${selectedAttributes[attribute.code]?.includes(value) ? styles.filterAttributeActive : ""}`}>
                        <input type="checkbox" value={value} onChange={() => handleAttributeChange(attribute.code, value)} checked={selectedAttributes[attribute.code]?.includes(value)} />
                        <span className={styles.filterAttributeCustomCheckbox}></span>
                        <span className={styles.filterAttributeLabel}>{value}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {attribute.values.length > 4 && (
                <button className={styles.toggleButton} onClick={() => toggleSection(attribute.code)}>
                  {expandedSections[attribute.code] ? "Скрыть" : "Показать все"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
