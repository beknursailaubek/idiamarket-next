import type { Metadata } from "next";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "IDIA Market – торговое, холодильное и складское оборудование",
  description: "IDIA Market предлагает торговое, холодильное и складское оборудование, а также коммерческую мебель. Широкий ассортимент, выгодные цены и удобная доставка по Казахстану. Гарантия качества и поддержка на каждом этапе для эффективной работы вашего бизнеса.",
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
