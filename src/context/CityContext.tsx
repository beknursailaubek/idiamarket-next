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

  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);

  // Определяем город из URL только при изменении маршрута
  useEffect(() => {
    const pathSegments = pathname.split("/");
    const cityFromUrl = pathSegments[1];
    const foundCity = cities.find((city) => city.uri === cityFromUrl);

    if (foundCity) {
      setSelectedCity(foundCity);
    }
  }, [pathname]);

  // Мемоизируем значение контекста, чтобы избежать лишних рендеров
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
