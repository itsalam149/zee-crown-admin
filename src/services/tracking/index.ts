import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import { Tracking, FetchTrackingParams, FetchTrackingResponse } from "./types";

export async function fetchTrackingHistory(
  client: SupabaseClient<Database>,
  { page = 1, limit = 10, orderId }: FetchTrackingParams
): Promise<FetchTrackingResponse> {
  let query = client.from("tracking_history").select("*", { count: "exact" });

  if (orderId) query = query.eq("order_id", orderId);

  query = query.order("updated_at", { ascending: false });

  const paginated = await queryPaginatedTable<Tracking, "tracking_history">({
    name: "tracking_history",
    page,
    limit,
    query,
  });

  return paginated;
}

export async function addTracking(
  client: SupabaseClient<Database>,
  payload: Omit<Tracking, "id">
) {
  const { data, error } = await client
    .from("tracking_history")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Tracking;
}

export async function editTracking(
  client: SupabaseClient<Database>,
  id: number,
  updates: Partial<Omit<Tracking, "id">>
) {
  const { data, error } = await client
    .from("tracking_history")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Tracking;
}

export async function deleteTracking(
  client: SupabaseClient<Database>,
  id: number
) {
  const { error } = await client
    .from("tracking_history")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}


