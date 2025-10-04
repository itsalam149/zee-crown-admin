'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Updates the status of a specific order.
 */
export async function updateOrderStatus(formData: FormData) {
    // ✅ Await the async Supabase server client
    const supabase = await createClient();

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
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: 'Status updated successfully.' };
}

/**
 * Deletes an order and its associated items.
 */
export async function deleteOrder(formData: FormData) {
    // ✅ Await the async Supabase server client
    const supabase = await createClient();

    const orderId = formData.get('orderId') as string;

    if (!orderId) {
        return { error: 'Order ID is missing.' };
    }

    try {
        // Assumes cascading delete is set up in your Supabase schema
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error("Error deleting order:", error);
            return { error: 'Failed to delete order.' };
        }

        revalidatePath('/dashboard/orders');
        return { success: 'Order deleted successfully.' };
    } catch (err) {
        console.error("Unexpected error deleting order:", err);
        return { error: 'Failed to delete order due to unexpected error.' };
    }
}
