import { Pagination } from "@/types/pagination";

export type Address = {
  id: number;
  user_id: string;
  label: string | null;
  name: string;
  mobile: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  created_at: string | null;
};

export interface FetchAddressesParams {
  page?: number;
  limit?: number;
  userId?: string;
  search?: string;
}

export interface FetchAddressesResponse {
  data: Address[];
  pagination: Pagination;
}

