"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface City {
  title: string;
  uri: string;
  code: string;
}

interface CityContextProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  cities: City[];
}

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
  const [selectedCity, setSelectedCity] = useState<City>(cities.find((city) => city.code === "almaty")!);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = pathname.split("/");
      const cityFromUrl = pathSegments[1];
      const city = cities.find((city) => city.uri === cityFromUrl);
      if (city) {
        setSelectedCity(city);
      }
    }
  }, [pathname]);

  return <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>{children}</CityContext.Provider>;
};
