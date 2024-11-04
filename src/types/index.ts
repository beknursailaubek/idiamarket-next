export interface Product {
  _id?: string;
  uri: string;
  sku: string;
  title: string;
  images?: string[];
  color?: Color;
  categories?: Category[];
  short_description?: ShortDescription[];
  attributes?: Attributes[];
  price: string;
  old_price?: string;
  price_from?: boolean;
  discount?: string;
  cashback?: number;
  cashback_amount?: string;
  is_available?: boolean;
  variants?: {
    colors?: Variant[];
    attributes?: Variant[];
  };
  stickers?: Sticker[];
  meta_data?: SeoMetadata;
  reviews?: number;
  rating?: number | 0;
  positive_reviews_rate?: number;
  view_count?: number;
  date?: string;
  url_videos?: string[];
  about_url?: string;
  is_enabled?: boolean;
  seo_redirects?: string[];
  description?: string;
}

export interface Category {
  _id?: string;
  title: string;
  uri: string;
  source?: string;
  parent?: Category;
  category_code: string;
  children?: Category[];
  image?: string;
  anchors?: Anchor[];
  meta_data?: SeoMetadata;
  faq?: FaqData;
}

export interface Attributes {
  _id?: string;
  code: string;
  title: string;
  is_active?: boolean;
  items?: AttributeItem[];
}

export interface AttributeItem {
  _id?: string;
  title: string;
  value: string;
  is_active?: boolean;
  display_type?: string;
  description?: string;
  show_description?: boolean;
  attribute_values?: string;
}

export interface Color {
  _id?: string;
  code: string;
  title: string;
  color_type?: number;
  hex: string;
}

export interface ShortDescription {
  _id?: string;
  title: string;
  code: string;
  value: string;
  icon?: string;
}

export interface Sticker {
  _id?: string;
  title: string;
  slug: string;
  text_color?: string;
  background_color: string;
  priority?: number;
  image?: string;
  description?: string;
}

export interface Variant {
  _id?: string;
  sku: string;
  uri: string;
  is_available?: boolean;
  attribute?: AttributeItem;
  color?: Color;
}

export interface Redirect {
  uri: string;
  image?: string;
  title: string;
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export interface Filters {
  priceRange: [number, number];
  colors: string[];
  attributes: { [key: string]: string[] };
}

export interface FilterValues {
  priceRange?: [number, number];
  colors?: string[];
  attributes?: { [key: string]: string[] };
}

export interface InitialData {
  products: Product[];
  category: Category;
  pagination: Pagination;
}

export interface SeoMetadata {
  _id?: string;
  meta_title?: string;
  meta_description?: string;
  page_title?: string;
  seo_header?: string;
  seo_text: string;
}

export interface FaqData {
  title: string;
  list: { question: string; answer: string }[];
}

export interface FavoritesContextProps {
  favorites?: string[];
  addToFavorite?: (sku: string) => void;
  removeFromFavorite?: (sku: string) => void;
}

export interface CityContextProps {
  selectedCity: City;
  setSelectedCity?: (city: City) => void;
  cities?: City[];
}

export interface City {
  name: string;
  title: string;
  uri: string;
  code: string;
}

export interface Anchor {
  title: string;
  uri: string;
}

export interface AttributeValue {
  title: string;
  code: string;
}

export interface Attribute {
  code: string;
  title: string;
  display_type: string;
  priority: number;
  values: AttributeValue[];
}

export interface FilterOptions {
  priceRange: [number, number];
  colors: Array<{ code: string; title: string; hex: string }>;
  attributes: Attribute[];
}
