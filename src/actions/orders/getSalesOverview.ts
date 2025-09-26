"use server";

import { getSupabaseServerActionClient } from "@/lib/supabase/server-action";
import { SalesOverview } from "@/services/orders/types";

export async function getSalesOverview(): Promise<SalesOverview> {
    const supabase = getSupabaseServerActionClient();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const { data: orders, error } = await supabase.from("orders").select("total_amount, created_at");

    if (error) {
        console.error("Error fetching sales overview:", error);
        return { today: 0, yesterday: 0, thisMonth: 0, lastMonth: 0, allTime: 0 };
    }

    const sales = orders.reduce(
        (acc, order) => {
            const orderDate = new Date(order.created_at);
            const totalAmount = order.total_amount || 0;

            if (orderDate.toDateString() === today.toDateString()) {
                acc.today += totalAmount;
            }
            if (orderDate.toDateString() === yesterday.toDateString()) {
                acc.yesterday += totalAmount;
            }
            if (
                orderDate.getMonth() === thisMonth.getMonth() &&
                orderDate.getFullYear() === thisMonth.getFullYear()
            ) {
                acc.thisMonth += totalAmount;
            }
            if (
                orderDate.getMonth() === lastMonth.getMonth() &&
                orderDate.getFullYear() === lastMonth.getFullYear()
            ) {
                acc.lastMonth += totalAmount;
            }
            acc.allTime += totalAmount;

            return acc;
        },
        { today: 0, yesterday: 0, thisMonth: 0, lastMonth: 0, allTime: 0 }
    );

    return sales;
}