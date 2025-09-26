import { Pagination } from "@/types/pagination";

export type Cart = {
  id: number;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CartItem = {
  id: number;
  cart_id: number | null;
  product_id: number | null;
  qty: number;
  added_at: string | null;
};

export interface FetchCartsParams {
  page?: number;
  limit?: number;
  userId?: string;
}

export interface FetchCartsResponse {
  data: Cart[];
  pagination: Pagination;
}


