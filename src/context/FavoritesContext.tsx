"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { FavoritesContextProps } from "@/types";

// Create the context with a default empty value
export const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

// Define the type for the provider's children prop
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(localStorage.getItem("favourites") || "[]");
      setFavorites(storedFavorites);
    }
  }, []);

  // Function to add a product to favorites
  const addToFavorite = (productCode: string) => {
    const updatedFavorites = [...favorites, productCode];
    setFavorites(updatedFavorites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavorites));
  };

  // Function to remove a product from favorites
  const removeFromFavorite = (productCode: string) => {
    const updatedFavorites = favorites.filter((code) => code !== productCode);
    setFavorites(updatedFavorites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavorites));
  };

  return <FavoritesContext.Provider value={{ favorites, addToFavorite, removeFromFavorite }}>{children}</FavoritesContext.Provider>;
};
