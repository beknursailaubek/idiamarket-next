import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CityProvider } from "@/context/CityContext";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <FavoritesProvider>
          <CityProvider>
            <Header />
            <main className="main">{children}</main>
          </CityProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
