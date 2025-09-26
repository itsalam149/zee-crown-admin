"use server";

import { createServerActionClient } from "@/lib/supabase/server-action";
import { OrdersExport } from "@/services/orders/types";

export async function exportOrders() {
  const supabase = createServerActionClient();

  const selectQuery = `
    *,
    profiles(name, email)
  `;

  const { data, error } = await supabase.from("orders").select(selectQuery);

  if (error) {
    console.error(`Error fetching orders:`, error);
    return { error: `Failed to fetch data for orders.` };
  }

  return {
    data: data.map(
      (order): OrdersExport => ({
        id: order.id,
        customer_name: order.profiles?.name ?? "",
        customer_email: order.profiles?.email ?? "",
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        status: order.status,
        created_at: order.created_at,
      })
    ),
  };
}