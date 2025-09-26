import { Pagination } from "@/types/pagination";
import { Product } from "../products/types";

export type OrderStatus = "pending" | "packed" | "shipped" | "delivered" | "cancelled";
export type OrderMethod = "COD" | "UPI" | "Card" | "Wallet";

export type Order = {
  id: number;
  user_id: string | null;
  status: OrderStatus | null;
  total_amount: number | null;
  shipping_name: string | null;
  shipping_email: string | null;
  shipping_mobile: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  payment_method: string | null;
  created_at: string | null;
  address_id: number | null;
  profiles?: { name: string | null } | null;
};

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchOrdersResponse {
  data: Order[];
  pagination: Pagination;
}

export type OrderDetails = Order & {
  order_items: Array<{
    id: number;
    order_id: number | null;
    product_id: number | null;
    qty: number;
    price: number;
    products: Pick<Product, "name">;
  }>;
};

export type OrdersExport = never;
