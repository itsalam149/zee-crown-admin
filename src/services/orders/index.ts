import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import {
  Order,
  FetchOrdersParams,
  FetchOrdersResponse,
  OrderDetails,
} from "./types";

export async function fetchOrders(
  client: SupabaseClient<Database>,
  {
    page = 1,
    limit = 10,
    search,
    status,
    method,
    startDate,
    endDate,
  }: FetchOrdersParams
): Promise<FetchOrdersResponse> {
  let query = client.from("orders").select("*, profiles!inner(name)", { count: "exact" });

  if (search) {
    query = query.ilike("profiles.name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (method) {
    query = query.eq("payment_method", method);
  }

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    const endDay = new Date(endDate);
    const nextDay = new Date(endDay);
    nextDay.setDate(endDay.getDate() + 1);

    query = query.lt("created_at", nextDay.toISOString());
  }

  query = query.order("created_at", { ascending: false });

  const paginatedOrders = await queryPaginatedTable<Order, "orders">({
    name: "orders",
    page,
    limit,
    query,
  });

  return paginatedOrders;
}

export async function fetchOrderDetails(
  client: SupabaseClient<Database>,
  { id }: { id: string }
) {
  const selectQuery = `*, profiles:profiles!inner(name, email), order_items(id, order_id, product_id, qty, price, products(name))`;

  const { data, error } = await client
    .from("orders")
    .select(selectQuery)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch order details: ${error.message}`);
  }

  if (!data) {
    console.error("Failed to fetch order details");
    throw new Error("Failed to fetch order details");
  }

  return {
    order: data as OrderDetails,
  };
}