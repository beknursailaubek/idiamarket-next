"use client";
import { ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CityProvider } from "@/context/CityContext";

interface ProvidersProps {
  children: ReactNode;
}
const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <FavoritesProvider>
        <CityProvider>
          {children}
          <ProgressBar height="3px" color="#034ea2" options={{ showSpinner: false }} shallowRouting />
        </CityProvider>
      </FavoritesProvider>
    </>
  );
};

export default Providers;
