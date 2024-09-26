"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./Filter.module.css";

interface Product {
  price: string;
  color?: { code: string; title: string; hex: string };
  attributes: Array<{
    code: string;
    items: Array<{ title: string; value: string; display_type: string }>;
  }>;
}

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  products: Product[];
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

const Filter: React.FC<FilterProps> = ({ onFilterChange, products }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const prices = products.length > 0 ? products.map((product) => parseInt(product.price, 10)) : [0];
  const minInitialPrice = Math.min(...prices);
  const maxInitialPrice = Math.max(...prices);

  const [minPrice, setMinPrice] = useState<number>(minInitialPrice);
  const [maxPrice, setMaxPrice] = useState<number>(maxInitialPrice);
  const [tempMinPrice, setTempMinPrice] = useState<number>(minInitialPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(maxInitialPrice);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string[] | [number, number] }>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  const colorMap = products.reduce((acc: { [key: string]: Color }, product) => {
    if (product.color && !acc[product.color.code]) {
      acc[product.color.code] = product.color;
    }

    return acc;
  }, {});

  const colors = Object.values(colorMap);

  // Group attributes from products
  const attributeMap = products.reduce<{ [key: string]: { values: Set<string>; display_type: string; code: string } }>((acc, product) => {
    if (product.attributes && Array.isArray(product.attributes)) {
      product.attributes.forEach((attribute) => {
        attribute.items.forEach((item) => {
          if (!acc[item.title]) {
            acc[item.title] = { values: new Set(), display_type: item.display_type, code: attribute.code };
          }
          acc[item.title].values.add(item.value);
        });
      });
    }
    return acc;
  }, {});

  // Convert attribute map to array format for rendering
  const attributes = Object.entries(attributeMap)
    .map(([title, { values, display_type, code }]) => ({
      title,
      values: Array.from(values),
      display_type,
      code,
    }))
    .filter((attribute) => attribute.values.length > 0);

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

    // Проверяем, есть ли атрибуты и они не undefined перед вызовом map
    const attribute = attributes.find((attr) => attr.code === attributeCode);
    const values = attribute ? attribute.values : [];

    const newAttributeFilters = Object.entries(newAttributes).flatMap(([code, values]) =>
      values.map((valueCode) => {
        const value = attribute ? values.find((val) => val === valueCode) : valueCode;
        return {
          key: `attribute:${code}:${valueCode}`,
          label: `${value}`,
        };
      })
    );

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

  const handleColorChange = (color: Color) => {
    const newSelectedColors = selectedColors.includes(color.code) ? selectedColors.filter((c) => c !== color.code) : [...selectedColors, color.code];

    setSelectedColors(newSelectedColors);
  };

  const handlePriceChange = () => {
    let adjustedMinPrice = Math.max(minInitialPrice, Math.min(tempMinPrice, maxInitialPrice));
    let adjustedMaxPrice = Math.min(maxInitialPrice, Math.max(tempMaxPrice, minInitialPrice));

    if (adjustedMinPrice > adjustedMaxPrice) {
      adjustedMinPrice = adjustedMaxPrice;
    }

    setTempMinPrice(adjustedMinPrice);
    setTempMaxPrice(adjustedMaxPrice);

    updateSelectedFilters();
  };

  const updateSelectedFilters = () => {
    const filters: SelectedFilter[] = [];

    if (tempMinPrice !== minInitialPrice || tempMaxPrice !== maxInitialPrice) {
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

    setSelectedFilters(filters);
  };

  const removeFilter = (filter: SelectedFilter) => {
    if (filter.type === "price") {
      setMinPrice(minInitialPrice);
      setMaxPrice(maxInitialPrice);
    }

    if (filter.type === "color") {
      setSelectedColors((prev) => prev.filter((colorCode) => !filter.label.includes(colorCode)));
    }

    updateSelectedFilters();
  };

  const clearAllFilters = () => {
    setMinPrice(minInitialPrice);
    setMaxPrice(maxInitialPrice);
    setSelectedColors([]);
    setSelectedAttributes({});
    updateSelectedFilters();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("colors[]");

    router.push(`${pathname}?${params.toString()}`);
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
              <input className={styles.filterBarInput} type="text" id="minPrice" value={formatPrice(tempMinPrice)} onBlur={handlePriceChange} onKeyDown={handleKeyDown} onChange={handleMinPriceChange} />
            </div>
            <span className={styles.filterBarDivider}>-</span>
            <div className={styles.filterBar}>
              <label className={styles.filterBarLabel} htmlFor="maxPrice">
                До
              </label>
              <input className={styles.filterBarInput} type="text" id="maxPrice" value={formatPrice(tempMaxPrice)} onBlur={handlePriceChange} onKeyDown={handleKeyDown} onChange={handleMaxPriceChange} />
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
