"use client";
import React, { useState, useEffect } from "react";
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
  key: string;
  label: string;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, products }) => {
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
  const [rangeValues, setRangeValues] = useState<{ [key: string]: { minValue: number; maxValue: number } }>({});

  const colorMap = products.reduce((acc: { [key: string]: Color }, product) => {
    if (product.color && !acc[product.color.code]) {
      acc[product.color.code] = product.color;
    }
    return acc;
  }, {});

  const colors = Object.values(colorMap);

  const attributeMap = products.reduce((acc: { [key: string]: { values: Set<string>; display_type: string; code: string } }, product) => {
    if (product.attributes && Array.isArray(product.attributes)) {
      product.attributes.forEach((attribute) => {
        if (attribute.items && Array.isArray(attribute.items)) {
          attribute.items.forEach((item) => {
            if (item.display_type) {
              if (!acc[item.title]) {
                acc[item.title] = { values: new Set(), display_type: item.display_type, code: attribute.code };
              }
              acc[item.title].values.add(item.value);
            }
          });
        }
      });
    }
    return acc;
  }, {});

  const attributes: Attribute[] = Object.entries(attributeMap)
    .map(([title, { values, display_type, code }]) => ({
      title,
      values: Array.from(values),
      display_type,
      code,
    }))
    .filter((attribute) => attribute.values.length > 0);

  useEffect(() => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      colors: selectedColors,
      attributes: selectedAttributes,
    });
  }, [minPrice, maxPrice, selectedColors, selectedAttributes]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value > tempMaxPrice) {
        value = tempMaxPrice; // Ensure min does not exceed max
      }
      setTempMinPrice(value);
      setMinPrice(value); // Update slider in real-time
      updateTrackBackground(value, tempMaxPrice);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/\s+/g, ""));
    if (!isNaN(value)) {
      if (value < tempMinPrice) {
        value = tempMinPrice; // Ensure max is not less than min
      }
      setTempMaxPrice(value);
      setMaxPrice(value); // Update slider in real-time
      updateTrackBackground(tempMinPrice, value);
    }
  };

  const handlePriceChange = () => {
    let adjustedMinPrice = Math.max(minInitialPrice, Math.min(tempMinPrice, maxInitialPrice));
    let adjustedMaxPrice = Math.min(maxInitialPrice, Math.max(tempMaxPrice, minInitialPrice));

    if (adjustedMinPrice > adjustedMaxPrice) {
      adjustedMinPrice = adjustedMaxPrice;
    }

    // Update state with validated values
    setMinPrice(adjustedMinPrice);
    setMaxPrice(adjustedMaxPrice);
    setTempMinPrice(adjustedMinPrice);
    setTempMaxPrice(adjustedMaxPrice);
    updateTrackBackground(adjustedMinPrice, adjustedMaxPrice);
  };

  const updateTrackBackground = (minPrice: number, maxPrice: number) => {
    const minPercent = ((minPrice - minInitialPrice) / (maxInitialPrice - minInitialPrice)) * 100;
    const maxPercent = ((maxPrice - minInitialPrice) / (maxInitialPrice - minInitialPrice)) * 100;

    const track = document.querySelector(".price-range__track") as HTMLElement;
    track.style.background = `linear-gradient(to right, var(--grey-light) 0%, var(--grey-light) ${minPercent}%, var(--red) ${minPercent}%, var(--red) ${maxPercent}%, var(--grey-light) ${maxPercent}%, var(--grey-light) 100%)`;
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

  const handleAttributeChange = (attributeCode: string, valueCode: string) => {
    const newAttributes = { ...selectedAttributes };

    if (!newAttributes[attributeCode]) {
      newAttributes[attributeCode] = [];
    }

    if (Array.isArray(newAttributes[attributeCode]) && newAttributes[attributeCode].includes(valueCode)) {
      newAttributes[attributeCode] = newAttributes[attributeCode].filter((val) => val !== valueCode);
    } else {
      newAttributes[attributeCode] = [...(newAttributes[attributeCode] as string[]), valueCode];
    }

    if ((newAttributes[attributeCode] as string[]).length === 0) {
      delete newAttributes[attributeCode];
    }

    setSelectedAttributes(newAttributes);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className={styles.filter}>
      {selectedFilters.length > 0 && (
        <div className={styles.selectedFilters}>
          <p className={styles.selectedFiltersTitle}>Вы выбрали:</p>
          <div className={styles.selectedFiltersItems}>
            {selectedFilters.map((filter, index) => (
              <button key={index} className={styles.selectedFiltersRemove} onClick={() => handleRemoveFilter(filter)}>
                <span>{filter.label} X</span>
              </button>
            ))}
          </div>
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
          <div className={styles.priceRange}>
            <input type="range" min={minInitialPrice} max={maxInitialPrice} value={tempMinPrice} onChange={handleMinPriceChange} className={styles.priceRangeSlider} />
            <input type="range" min={minInitialPrice} max={maxInitialPrice} value={tempMaxPrice} onChange={handleMaxPriceChange} className={styles.priceRangeSlider} />
            <div className={styles.priceRangeTrack}></div>
          </div>
        </div>

        {/* Color Filter Section */}
        {colors.length > 0 && (
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

        {/* Attribute Filter Section */}
        {attributes.map((attribute, index) => (
          <div key={`${attribute.title}-${index}`} className={styles.filterSection}>
            <label className={styles.filterTitle}>{attribute.title}</label>
            <div className={styles.filterAttributes}>
              {attribute.values.map((value) => (
                <label key={value} className={`${styles.filterAttribute} ${selectedAttributes[attribute.code]?.includes(value) ? styles.filterAttributeActive : ""}`}>
                  <input type="checkbox" value={value} onChange={() => handleAttributeChange(attribute.code, value)} checked={selectedAttributes[attribute.code]?.includes(value)} />
                  <span className={styles.filterAttributeCustomCheckbox}></span>
                  <span className={styles.filterAttributeLabel}>{value}</span>
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
