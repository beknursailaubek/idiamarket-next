export interface Product {
  _id?: string;
  uri: string;
  sku: string;
  title: string;
  images?: string[];
  color?: Color;
  categories?: Category[] | undefined;
  short_description?: ShortDescription[] | undefined;
  attributes?: Attributes[] | undefined;
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
  rating?: number;
  positive_reviews_rate?: number;
  view_count?: number;
  url_videos?: string[];
  about_url?: string;
  is_enabled?: boolean;
  seo_redirects?: string[];
}

export interface Category {
  _id?: string;
  title: string;
  uri: string;
  source?: string;
  parent?: Category | null;
  category_code: string;
  children?: Category[];
  image?: string;
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

export interface SeoMetadata {
  _id?: string;
  meta_title?: string;
  meta_description?: string;
  meta_header?: string;
  seo_text?: string;
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

export interface InitialData {
  products: Product[];
  category: Category;
  pagination: Pagination;
}

export interface Filters {
  priceRange: [number, number];
  colors: Array<{ code: string }>;
  attributes: Record<string, string[]>;
}
