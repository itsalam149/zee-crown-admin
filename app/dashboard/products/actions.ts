'use server'

// IMPORTANT: Change this import
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    // IMPORTANT: Use the admin client here
    const supabase = createAdminClient();

    const rawFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        category: formData.get('category') as string,
        image_url: formData.get('image_url') as string,
    };

    const { error } = await supabase.from('products').insert([rawFormData]);

    if (error) {
        console.error('Error creating product:', error);
        return { error: 'Failed to create product.' };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

// Your delete function can also be updated to use the admin client
export async function deleteProduct(formData: FormData) {
    const supabase = createAdminClient(); // Also use admin client here
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

    revalidatePath('/dashboard/products');
    return { success: 'Product deleted successfully.' };
}