"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Filter.module.css";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  onFilterConfirm: () => void;
  filterOptions: {
    priceRange: [number, number];
    colors: Color[];
    attributes: Attribute[];
  };
}

interface FilterValues {
  priceRange: [number, number];
  colors: string[];
  attributes: { [key: string]: string[] | [number, number] };
}

interface Attribute {
  title: string;
  values: string[];
  display_type: string;
  code: string;
}

interface Color {
  code: string;
  title: string;
  hex: string;
}

interface SelectedFilter {
  label: string;
  type: "color" | "price" | "attribute";
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, filterOptions, onFilterConfirm }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { priceRange, colors, attributes } = filterOptions || { priceRange: [0, 0], colors: [], attributes: [] };

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string[] | [number, number] }>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

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
  const handleAttributeChange = (attributeCode, valueCode) => {
    const newAttributes = { ...selectedAttributes };

    if (!newAttributes[attributeCode]) {
      newAttributes[attributeCode] = [];
    }

    if (newAttributes[attributeCode].includes(valueCode)) {
      newAttributes[attributeCode] = newAttributes[attributeCode].filter((val) => val !== valueCode);
    } else {
      newAttributes[attributeCode].push(valueCode);
    }

    if (newAttributes[attributeCode].length === 0) {
      delete newAttributes[attributeCode];
    }

    setSelectedAttributes(newAttributes);
    updateSelectedFilters();
    onFilterConfirm(); // Call onFilterConfirm after updating attributes
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
      onFilterConfirm();
    }
  };

  const handleBlur = () => {
    handlePriceChange();
    onFilterConfirm();
  };

  const handleColorChange = (color: Color) => {
    const newSelectedColors = selectedColors.includes(color.code) ? selectedColors.filter((c) => c !== color.code) : [...selectedColors, color.code];

    setSelectedColors(newSelectedColors);
    onFilterConfirm();
  };

  const handlePriceChange = () => {
    let adjustedMinPrice = Math.max(priceRange[0], Math.min(tempMinPrice, priceRange[1]));
    let adjustedMaxPrice = Math.min(priceRange[1], Math.max(tempMaxPrice, priceRange[0]));

    if (adjustedMinPrice > adjustedMaxPrice) {
      adjustedMinPrice = adjustedMaxPrice;
    }

    setMinPrice(adjustedMinPrice);
    setMaxPrice(adjustedMaxPrice);
  };

  const updateSelectedFilters = () => {
    const filters: SelectedFilter[] = [];

    // Handle price filter
    if (tempMinPrice !== priceRange[0] || tempMaxPrice !== priceRange[1]) {
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
    // Reset the price range if it's a price filter
    if (filter.type === "price") {
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
      setTempMinPrice(priceRange[0]);
      setTempMaxPrice(priceRange[1]);
    }

    // Deselect the color if it's a color filter
    if (filter.type === "color") {
      const colorTitle = filter.label.split(": ")[1]; // Extract color title from label
      const colorToRemove = colors.find((color) => color.title === colorTitle);

      if (colorToRemove) {
        setSelectedColors((prev) => prev.filter((colorCode) => colorCode !== colorToRemove.code));
      }
    }

    // Deselect the attribute if it's an attribute filter
    if (filter.type === "attribute") {
      const [attributeTitle, attributeValue] = filter.label.split(": "); // Extract attribute title and value
      const attribute = attributes.find((attr) => attr.title === attributeTitle);

      if (attribute) {
        setSelectedAttributes((prevAttributes) => {
          const updatedAttributes = { ...prevAttributes };
          updatedAttributes[attribute.code] = (updatedAttributes[attribute.code] as string[]).filter((val) => val !== attributeValue);

          // If no values left for the attribute, remove the attribute key
          if (updatedAttributes[attribute.code].length === 0) {
            delete updatedAttributes[attribute.code];
          }

          return updatedAttributes;
        });
      }
    }

    // Update the filters to reflect changes
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
                <span>{filter.label} X</span>
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
          <label htmlFor="price" className={styles.filterTitle}>
            Цена (₸)
          </label>
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
            <label className={styles.filterTitle}>Цвет</label>
            <div className={styles.filterColors}>
              {colors.map((color) => (
                <label key={color.code} className={`${styles.filterColor} ${selectedColors.includes(color.code) ? styles.filterColorActive : ""}`}>
                  <input type="checkbox" value={color.code} onChange={() => handleColorChange(color)} checked={selectedColors.includes(color.code)} />
                  <span className={styles.filterColorPalette} style={{ backgroundColor: color.hex }}></span>
                  <span className={styles.filterColorLabel}>{color.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {attributes.map((attribute, index) => (
          <div key={`${attribute.title}-${index}`} className={styles.filterSection}>
            <label className={styles.filterTitle}>{attribute.title}</label>
            <div className={styles.filterAttributes}>
              {attribute.values.map((value) => (
                <label key={value} className={`${styles.filterAttribute} ${selectedAttributes[attribute.code]?.includes(value) ? styles.filterAttributeActive : ""}`}>
                  <input type="checkbox" value={value} onChange={() => handleAttributeChange(attribute.code, value)} checked={selectedAttributes[attribute.code]?.includes(value)} />
                  <span className={styles.filterAttributeCustomCheckbox}></span>
                  <span className={styles.filterAttributeLabel}>{value}</span>
                  <span className={styles.filterAttributeCount}></span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
