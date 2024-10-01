"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Filter.module.css";
import { FilterOptions, FilterValues, Color } from "@/types";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  filterOptions: FilterOptions;
}

interface SelectedFilter {
  label: string;
  type: "color" | "price" | "attribute";
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, filterOptions }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { priceRange = [0, 0], colors = [], attributes = [] } = filterOptions || {};

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  const [showColors, setShowColors] = useState<boolean>(true);
  const [visibleAttributes, setVisibleAttributes] = useState<{ [key: string]: boolean }>(attributes?.reduce((acc, attr) => ({ ...acc, [attr.code]: true }), {}));

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

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

  useEffect(() => {
    if (filterOptions && filterOptions.priceRange) {
      const { priceRange } = filterOptions;
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
      setTempMinPrice(priceRange[0]);
      setTempMaxPrice(priceRange[1]);
    }
  }, [filterOptions]);

  // Handle attribute changes
  const handleAttributeChange = (attributeCode: string, valueCode: string) => {
    setSelectedAttributes((prevAttributes) => {
      const attributeValues = prevAttributes[attributeCode] || [];

      // Toggle the value in the array
      const newValues = attributeValues.includes(valueCode) ? attributeValues.filter((val) => val !== valueCode) : [...attributeValues, valueCode];

      // Create a new attributes object with the updated value
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
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value > tempMaxPrice) {
        value = tempMaxPrice;
      }
      setTempMinPrice(value);
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value < tempMinPrice) {
        value = tempMinPrice;
      }
      setTempMaxPrice(value);
      setMaxPrice(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePriceChange();
    }
  };

  const handleBlur = () => {
    handlePriceChange();
  };

  const handleColorChange = (color: Color) => {
    const newSelectedColors = selectedColors.includes(color.code) ? selectedColors.filter((c) => c !== color.code) : [...selectedColors, color.code];

    setSelectedColors(newSelectedColors as string[]);
  };

  const handlePriceChange = () => {
    let adjustedMinPrice = Math.max(priceRange[0], Math.min(tempMinPrice, priceRange[1]));
    let adjustedMaxPrice = Math.min(priceRange[1], Math.max(tempMaxPrice, priceRange[0]));

    if (adjustedMinPrice > adjustedMaxPrice) {
      adjustedMinPrice = adjustedMaxPrice;
    }

    setMinPrice(adjustedMinPrice);
    setMaxPrice(adjustedMaxPrice);

    updateSelectedFilters();
  };

  const updateSelectedFilters = () => {
    const filters: SelectedFilter[] = [];

    // Handle price filter
    if (priceRange && (tempMinPrice !== priceRange[0] || tempMaxPrice !== priceRange[1])) {
      filters.push({
        label: `Цена: от ${formatPrice(tempMinPrice)} до ${formatPrice(tempMaxPrice)}`,
        type: "price",
      });
    }

    // Handle color filter
    selectedColors.forEach((colorCode) => {
      const color = colors.find((color) => color.code === colorCode);
      if (color) {
        filters.push({
          label: `Цвет: ${color.title}`,
          type: "color",
        });
      }
    });

    // Handle attribute filter
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
    if (filter.type === "price") {
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
      setTempMinPrice(priceRange[0]);
      setTempMaxPrice(priceRange[1]);
    }

    if (filter.type === "color") {
      const colorTitle = filter.label.split(": ")[1];
      const colorToRemove = colors.find((color) => color.title === colorTitle);

      if (colorToRemove) {
        setSelectedColors((prev) => prev.filter((colorCode) => colorCode !== colorToRemove.code));
      }
    }

    if (filter.type === "attribute") {
      const [attributeTitle, attributeValue] = filter.label.split(": ");
      const attribute = attributes.find((attr) => attr.title === attributeTitle);

      if (attribute) {
        setSelectedAttributes((prevAttributes) => {
          const updatedAttributes = { ...prevAttributes };

          if (Array.isArray(updatedAttributes[attribute.code])) {
            updatedAttributes[attribute.code] = (updatedAttributes[attribute.code] as string[]).filter((val) => val !== attributeValue);

            if ((updatedAttributes[attribute.code] as string[]).length === 0) {
              delete updatedAttributes[attribute.code];
            }
          }

          return updatedAttributes;
        });
      }
    }

    updateSelectedFilters();
  };

  const clearAllFilters = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setSelectedColors([]);
    setSelectedAttributes({});
    updateSelectedFilters();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("colors[]");

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className={styles.filter}>
      {/* Selected Filters Section */}
      {selectedFilters.length > 0 && (
        <div className={styles.selectedFilters}>
          <p className={styles.selectedFiltersTitle}>Вы выбрали:</p>
          <div className={styles.selectedFiltersItems}>
            {selectedFilters.map((filter, index) => (
              <button key={index} className={styles.selectedFiltersRemove} onClick={() => removeFilter(filter)}>
                {filter.label} <Image className={styles.selectedFiltersRemoveImage} src="/images/icons/close.svg" width={20} height={20} alt="" />
              </button>
            ))}
          </div>
          <button className={styles.selectedFiltersReset} onClick={clearAllFilters}>
            Очистить все
          </button>
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
                    <label key={color.code} className={`${styles.filterColor} ${selectedColors.includes(color.code) ? styles.filterColorActive : ""}`}>
                      <input type="checkbox" value={color.code} onChange={() => handleColorChange(color)} checked={selectedColors.includes(color.code)} />
                      <span className={styles.filterColorPalette} style={{ backgroundColor: color.hex }}></span>
                      <span className={styles.filterColorLabel}>{color.title}</span>
                    </label>
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
                    <label key={value} className={`${styles.filterAttribute} ${selectedAttributes[attribute.code]?.includes(value) ? styles.filterAttributeActive : ""}`}>
                      <input type="checkbox" value={value} onChange={() => handleAttributeChange(attribute.code, value)} checked={selectedAttributes[attribute.code]?.includes(value)} />
                      <span className={styles.filterAttributeCustomCheckbox}></span>
                      <span className={styles.filterAttributeLabel}>{value}</span>
                    </label>
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
  );
};

export default Filter;
