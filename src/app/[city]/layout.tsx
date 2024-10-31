import type { Metadata } from "next";
import { cities } from "@/lib/data";
import { notFound, redirect } from "next/navigation";

type CityLayoutProps = {
  children: React.ReactNode;
  params: { city: string };
};

export async function generateMetadata({ params }: CityLayoutProps): Promise<Metadata> {
  const { city } = params;
  let cityTitle = "";

  const matchedCity = cities.find((c) => c.uri === city);
  if (matchedCity) {
    cityTitle = matchedCity.title;
  } else {
    return notFound();
  }

  return {
    title: `IDIA Market - торговое оборудование в ${cityTitle}`,
    description: "IDIA Market – интернет-магазин торгового, холодильного и складского оборудования для бизнеса в Казахстане. Бесплатная доставка. Закажите качественное оборудование для успешного бизнеса!",
  };
}

export default function CityLayout({ children, params }: CityLayoutProps) {
  const { city } = params;

  // Валидация города
  if (!cities.some((c) => c.uri === city)) {
    notFound();
  }

  return <>{children}</>;
}
