import { Pagination } from "@/types/pagination";
import { Order } from "../orders/types";

export type Customer = {
  id: string; // uuid
  name: string | null;
  email: string | null;
  mobile: string | null;
  role: string | null;
  created_at: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
};

export interface FetchCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchCustomersResponse {
  data: Customer[];
  pagination: Pagination;
}

export type CustomerOrder = Pick<
  Order,
  "id" | "created_at" | "payment_method" | "total_amount" | "status"
> & {
  profiles: Pick<Customer, "name" | "address" | "phone"> | null;
};
