import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import { Cart, CartItem, FetchCartsParams, FetchCartsResponse } from "./types";

export async function fetchCarts(
  client: SupabaseClient<Database>,
  { page = 1, limit = 10, userId }: FetchCartsParams
): Promise<FetchCartsResponse> {
  let query = client.from("carts").select("*", { count: "exact" });

  if (userId) query = query.eq("user_id", userId);

  query = query.order("updated_at", { ascending: false });

  const paginated = await queryPaginatedTable<Cart, "carts">({
    name: "carts",
    page,
    limit,
    query,
  });

  return paginated;
}

export async function fetchCartItems(
  client: SupabaseClient<Database>,
  cartId: number
): Promise<CartItem[]> {
  const { data, error } = await client
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CartItem[];
}

export async function addCartItem(
  client: SupabaseClient<Database>,
  payload: Omit<CartItem, "id" | "added_at">
) {
  const { data, error } = await client
    .from("cart_items")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CartItem;
}

export async function editCartItem(
  client: SupabaseClient<Database>,
  id: number,
  updates: Partial<Omit<CartItem, "id" | "added_at">>
) {
  const { data, error } = await client
    .from("cart_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CartItem;
}

export async function deleteCartItem(
  client: SupabaseClient<Database>,
  id: number
) {
  const { error } = await client.from("cart_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}


