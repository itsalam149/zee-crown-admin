import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import {
  Address,
  FetchAddressesParams,
  FetchAddressesResponse,
} from "./types";

export async function fetchAddresses(
  client: SupabaseClient<Database>,
  { page = 1, limit = 10, userId, search }: FetchAddressesParams
): Promise<FetchAddressesResponse> {
  let query = client.from("addresses").select("*", { count: "exact" });

  if (userId) query = query.eq("user_id", userId);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,mobile.ilike.%${search}%,label.ilike.%${search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const paginated = await queryPaginatedTable<Address, "addresses">({
    name: "addresses",
    page,
    limit,
    query,
  });

  return paginated;
}

export async function addAddress(
  client: SupabaseClient<Database>,
  payload: Omit<Address, "id" | "created_at">
) {
  const { data, error } = await client
    .from("addresses")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Address;
}

export async function editAddress(
  client: SupabaseClient<Database>,
  id: number,
  updates: Partial<Omit<Address, "id" | "created_at">>
) {
  const { data, error } = await client
    .from("addresses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Address;
}

export async function deleteAddress(
  client: SupabaseClient<Database>,
  id: number
) {
  const { error } = await client.from("addresses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}


