"use client";

import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CityContextProps, City } from "@/types";

export const CityContext = createContext<CityContextProps | undefined>(undefined);

interface CityProviderProps {
  children: ReactNode;
}

const cities: City[] = [
  { title: "Алматы", uri: "", code: "almaty" },
  { title: "Астана", uri: "astana", code: "astana" },
  { title: "Шымкент", uri: "shymkent", code: "shymkent" },
  { title: "Актау", uri: "aktau", code: "aktau" },
  { title: "Актобе", uri: "aktobe", code: "aktobe" },
  { title: "Атырау", uri: "atyrau", code: "atyrau" },
  { title: "Жанаозен", uri: "janaozen", code: "janaozen" },
  { title: "Жезказган", uri: "jezkazgan", code: "jezkazgan" },
  { title: "Караганда", uri: "karaganda", code: "karaganda" },
  { title: "Кокшетау", uri: "kokshetau", code: "kokshetau" },
  { title: "Костанай", uri: "kostanai", code: "kostanai" },
  { title: "Кызылорда", uri: "kyzylorda", code: "kyzylorda" },
  { title: "Павлодар", uri: "pavlodar", code: "pavlodar" },
  { title: "Петропавловск", uri: "petropavlovsk", code: "petropavlovsk" },
  { title: "Семей", uri: "semei", code: "semei" },
  { title: "Талдыкорган", uri: "taldykorgan", code: "taldykorgan" },
  { title: "Тараз", uri: "taraz", code: "taraz" },
  { title: "Туркестан", uri: "turkestan", code: "turkestan" },
  { title: "Уральск", uri: "uralsk", code: "uralsk" },
  { title: "Усть-Каменогорск", uri: "ust-kamenogorsk", code: "ust-kamenogorsk" },
];

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
