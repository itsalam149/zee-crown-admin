import { Pagination } from "@/types/pagination";
import { Product } from "../products/types";

export type OrderStatus = "pending" | "packed" | "shipped" | "delivered" | "cancelled";
export type OrderMethod = "COD" | "UPI" | "Card" | "Wallet";

export type Order = {
  id: number;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_email: string;
  shipping_mobile: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  payment_method: string;
  created_at: string;
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
    order_id: number;
    product_id: number;
    qty: number;
    price: number;
    products: Pick<Product, "name">;
  }>;
};

export type OrdersExport = {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export type SalesOverview = {
  today: number;
  yesterday: number;
  thisMonth: number;
  lastMonth: number;
  allTime: number;
};