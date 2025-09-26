import { Pagination } from "@/types/pagination";

export type Tracking = {
  id: number;
  order_id: number | null;
  status: string | null;
  updated_at: string | null;
};

export interface FetchTrackingParams {
  page?: number;
  limit?: number;
  orderId?: number;
}

export interface FetchTrackingResponse {
  data: Tracking[];
  pagination: Pagination;
}


