import type { Metadata } from "next";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "IDIA Market - торговое оборудование в Алматы",
  description: "IDIA Market – интернет-магазин торгового, холодильного и складского оборудования для бизнеса в Казахстане. Бесплатная доставка. Закажите качественное оборудование для успешного бизнеса!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="h-full">
        <Providers>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
