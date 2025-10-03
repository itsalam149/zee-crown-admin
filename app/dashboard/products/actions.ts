// app/dashboard/products/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
    const supabase = createClient();
    const productId = formData.get('productId') as string;

    if (!productId) {
        return { error: 'Product ID is missing.' };
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        return { error: 'Failed to delete product.' };
    }

    // Revalidate the path to refresh the product list
    revalidatePath('/dashboard/products');
    return { success: 'Product deleted successfully.' };
}