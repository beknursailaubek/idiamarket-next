"use client";

import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CityContextProps, City } from "@/types";
import { cities } from "@/lib/data";

export const CityContext = createContext<CityContextProps | undefined>(undefined);

interface CityProviderProps {
  children: ReactNode;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const defaultCity = cities.find((city) => city.code === "almaty")!;

  const getCityFromPath = (path: string): City | undefined => {
    const pathSegments = path.split("/");
    const cityFromUrl = pathSegments[1]; // Извлекаем город из URL
    return cities.find((city) => city.uri === cityFromUrl);
  };

  const getCityFromStorageOrUrl = (): City => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      const parsedCity = JSON.parse(storedCity);
      return cities.find((city) => city.code === parsedCity.code) || defaultCity;
    }

    return getCityFromPath(pathname) || defaultCity;
  };

  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);

  // Загружаем город из localStorage или URL при первой загрузке
  useEffect(() => {
    const initialCity = getCityFromStorageOrUrl();
    setSelectedCity(initialCity);
  }, []);

  // Обновляем город при изменении URL
  useEffect(() => {
    const cityFromUrl = getCityFromPath(pathname);
    if (cityFromUrl && cityFromUrl.code !== selectedCity.code) {
      setSelectedCity(cityFromUrl);
    }
  }, [pathname]);

  // Сохраняем выбранный город в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
  }, [selectedCity]);

  const value = useMemo(
    () => ({
      selectedCity,
      setSelectedCity,
      cities,
    }),
    [selectedCity]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};
