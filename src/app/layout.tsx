import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers/Providers";

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
        <Providers>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
