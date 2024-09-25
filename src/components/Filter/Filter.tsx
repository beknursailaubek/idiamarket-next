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

  // Extract prices from products and set initial price range
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

  useEffect(() => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      colors: selectedColors,
      attributes: selectedAttributes,
    });
  }, [minPrice, maxPrice, selectedColors, selectedAttributes]);

  const updateURLParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update price range in URL
    params.set("minPrice", String(minPrice));
    params.set("maxPrice", String(maxPrice));

    // Update selected colors in URL
    params.delete("colors[]"); // First clear the color params to avoid duplicates
    selectedColors.forEach((color) => {
      params.append("colors[]", color);
    });

    // You can similarly add logic for attributes if needed

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value > tempMaxPrice) {
        value = tempMaxPrice; // Ensure min does not exceed max
      }
      setTempMinPrice(value);
      setMinPrice(value); // Update slider in real-time
    }
    updateSelectedFilters();
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value < tempMinPrice) {
        value = tempMinPrice; // Ensure max is not less than min
      }
      setTempMaxPrice(value);
      setMaxPrice(value); // Update slider in real-time
    }
    updateSelectedFilters();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePriceChange();
    }
  };

  const handleColorChange = (color: Color) => {
    const newSelectedColors = selectedColors.includes(color.code) ? selectedColors.filter((c) => c !== color.code) : [...selectedColors, color.code];

    // Update state first
    setSelectedColors(newSelectedColors);
    updateSelectedFilters(); // Update selected filters
  };

  const handlePriceChange = () => {
    let adjustedMinPrice = Math.max(minInitialPrice, Math.min(tempMinPrice, maxInitialPrice));
    let adjustedMaxPrice = Math.min(maxInitialPrice, Math.max(tempMaxPrice, minInitialPrice));

    if (adjustedMinPrice > adjustedMaxPrice) {
      adjustedMinPrice = adjustedMaxPrice;
    }

    // Update state with validated values first
    setMinPrice(adjustedMinPrice);
    setMaxPrice(adjustedMaxPrice);
    setTempMinPrice(adjustedMinPrice);
    setTempMaxPrice(adjustedMaxPrice);

    updateSelectedFilters(); // Then update selected filters
  };
  const updateSelectedFilters = () => {
    const filters: SelectedFilter[] = [];

    if (minPrice !== minInitialPrice || maxPrice !== maxInitialPrice) {
      filters.push({
        label: `Цена: от ${minPrice} до ${maxPrice}`,
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

    // Add logic for attributes if needed

    setSelectedFilters(filters);

    // Only now, update the URL after the filters are set
    updateURLParams();
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

    // Clear URL parameters
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("colors[]");

    // You can add additional logic to clear attributes if needed

    // Update the URL
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
        {/* Price Filter Section */}
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

        {/* Color Filter Section */}
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
      </div>
    </div>
  );
};

export default Filter;
