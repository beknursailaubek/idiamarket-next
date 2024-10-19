import { cities } from "@/lib/data";
import { notFound, redirect } from "next/navigation";

type CityLayoutProps = {
  children: React.ReactNode;
  params: { city: string };
};

export default function CityLayout({ children, params }: CityLayoutProps) {
  const { city } = params;

  // Валидация города
  if (!cities.some((c) => c.uri === city)) {
    notFound();
  }

  return <>{children}</>;
}
