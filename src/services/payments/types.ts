import { Pagination } from "@/types/pagination";

export type PaymentMethod = "COD" | "UPI" | "Card" | "Wallet";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type Payment = {
  id: number;
  order_id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string | null;
  amount: number;
  created_at: string | null;
};

export interface FetchPaymentsParams {
  page?: number;
  limit?: number;
  orderId?: number;
}

export interface FetchPaymentsResponse {
  data: Payment[];
  pagination: Pagination;
}


