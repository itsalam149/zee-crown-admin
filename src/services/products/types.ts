import { Pagination } from "@/types/pagination";

export type ProductStatus = "selling" | "out-of-stock";

// Align with new public.products schema
export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: "Medicines" | "Perfumes" | "Cosmetics" | "Food" | null;
  created_at: string | null;
  stock: number | null;
  expiry_date: string | null; // ISO date string
  prescription_required: boolean | null;
};

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  priceSort?: "lowest-first" | "highest-first";
  dateSort?: "date-added-asc" | "date-added-desc";
}

export interface FetchProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export type ProductDetails = Product;
