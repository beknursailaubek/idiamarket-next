import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CityProvider } from "@/context/CityContext";

export const metadata: Metadata = {
  title: "IDIA Market – купить торговое оборудование",
  description: "Качественные товары по доступным ценам на idiamarket.kz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="h-full">
        <FavoritesProvider>
          <CityProvider>
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </CityProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
