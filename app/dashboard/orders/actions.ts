'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Updates the status of a specific order.
 * This is the most common and essential update operation.
 */
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
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: 'Status updated successfully.' };
}

/**
 * Deletes an order and its associated items.
 * Use this carefully! It's better to set an order's status to 'cancelled'.
 * This is mainly useful for removing test data or truly erroneous orders.
 */
export async function deleteOrder(formData: FormData) {
    const supabase = createClient();
    const orderId = formData.get('orderId') as string;

    if (!orderId) {
        return { error: 'Order ID is missing.' };
    }

    // Your Supabase schema should have cascading deletes set up so that
    // deleting an order also deletes its corresponding `order_items`.
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
}