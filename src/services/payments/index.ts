import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import { Payment, FetchPaymentsParams, FetchPaymentsResponse } from "./types";

export async function fetchPayments(
  client: SupabaseClient<Database>,
  { page = 1, limit = 10, orderId }: FetchPaymentsParams
): Promise<FetchPaymentsResponse> {
  let query = client.from("payments").select("*", { count: "exact" });

  if (orderId) query = query.eq("order_id", orderId);

  query = query.order("created_at", { ascending: false });

  const paginated = await queryPaginatedTable<Payment, "payments">({
    name: "payments",
    page,
    limit,
    query,
  });

  return paginated;
}

export async function addPayment(
  client: SupabaseClient<Database>,
  payload: Omit<Payment, "id" | "created_at">
) {
  const { data, error } = await client
    .from("payments")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Payment;
}

export async function editPayment(
  client: SupabaseClient<Database>,
  id: number,
  updates: Partial<Omit<Payment, "id" | "created_at">>
) {
  const { data, error } = await client
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Payment;
}

export async function deletePayment(
  client: SupabaseClient<Database>,
  id: number
) {
  const { error } = await client.from("payments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}


