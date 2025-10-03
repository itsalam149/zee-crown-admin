'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
    const supabase = createClient();

    const orderId = formData.get('orderId') as string;
    const newStatus = formData.get('newStatus') as string;

    if (!orderId || !newStatus) {
        return { error: 'Missing order ID or new status.' };
    }

    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

    if (error) {
        console.error("Error updating status:", error);
        return { error: 'Failed to update order status.' };
    }

    revalidatePath('/dashboard/orders');
    return { success: 'Status updated successfully.' };
}