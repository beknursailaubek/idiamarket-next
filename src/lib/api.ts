import { InitialData } from "@/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getProductsByCategory(slug: string) {
  const url = `${apiUrl}/categories/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");

  console.log(res);
  return res.json();
}

export async function getFilterOptions(slug: string) {
  const url = `${apiUrl}/categories/${slug}/filters`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch filters");
  return res.json();
}

export const getProductsByFilters = async (filters: { [key: string]: string[] }) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, values]) => {
    queryParams.append(key, values.join(","));
  });

  const response = await fetch(`${apiUrl}/products?${queryParams.toString()}`);

  if (!response.ok) throw new Error("Failed to fetch products");

  return response.json();
};
