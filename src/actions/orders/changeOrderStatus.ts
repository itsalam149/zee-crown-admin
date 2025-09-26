"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@/lib/supabase/server-action";
import { ServerActionResponse } from "@/types/server-action";
import { OrderStatus } from "@/services/orders/types";

export async function changeOrderStatus(
  orderId: number,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  const supabase = getSupabaseServerActionClient();

  const { error: dbError } = await supabase
    .from("orders")
    .update({ status: newOrderStatus })
    .eq("id", orderId);

  if (dbError) {
    console.error("Database update failed:", dbError);
    return { dbError: "Failed to update order status." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}