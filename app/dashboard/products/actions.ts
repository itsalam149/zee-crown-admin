'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
// Removed unused redirect import

import sharp from 'sharp';

export async function createProduct(formData: FormData) {
    const supabase = createAdminClient();
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) ?? '';
    const price = parseFloat(formData.get('price') as string) || 0;
    const mrp = parseFloat(formData.get('mrp') as string) || 0;
    const category = formData.get('category') as string;
    let imageUrl = (formData.get('image_url') as string) || '';

    try {
        const imageFile = formData.get('image_file') as File | null;
        if (imageFile && typeof imageFile === 'object') {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const compressed = await sharp(buffer).rotate().webp({ quality: 80 }).toBuffer();
            const uploadBytes = new Uint8Array(compressed);
            const safeName = imageFile.name?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
            const filePath = `public/${Date.now()}_${safeName}.webp`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, uploadBytes, { contentType: 'image/webp', upsert: false });

            if (!uploadData || uploadError) return { error: 'Failed to upload image.' };
            const { data: pub } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
            imageUrl = pub.publicUrl;
        }
    } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : 'Unexpected error' };
    }

    const { error } = await supabase.from('products').insert([{ name, description, price, mrp, category, image_url: imageUrl || null }]);
    if (error) return { error: error.message || 'Failed to create product.' };
    revalidatePath('/dashboard/products');
    return { success: true } as const;
}

export async function deleteProduct(formData: FormData) {
    const supabase = createAdminClient();
    const productId = formData.get('productId') as string;
    if (!productId) return { error: 'Product ID missing' };
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) return { error: 'Failed to delete product.' };
    revalidatePath('/dashboard/products');
    return { success: 'Product deleted successfully.' };
}