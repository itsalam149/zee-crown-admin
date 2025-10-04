'use server'

// IMPORTANT: Change this import
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from 'sharp';

export async function createProduct(formData: FormData) {
    // IMPORTANT: Use the admin client here
    const supabase = createAdminClient();

    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) ?? '';
    const price = parseFloat(formData.get('price') as string) || 0;
    const category = formData.get('category') as string;
    let imageUrl = (formData.get('image_url') as string) || '';

    // If an image file is provided, upload it using the admin client
    try {
        const imageFile = formData.get('image_file') as File | null;
        if (imageFile && typeof imageFile === 'object') {
            const fileArrayBuffer = await imageFile.arrayBuffer();
            let imageBuffer = Buffer.from(fileArrayBuffer);

            // Compress server-side to target <= 250KB while preserving quality
            // Strategy: try webp at quality 80, then reduce quality progressively until <= 250KB or min quality reached
            const MAX_BYTES = 250 * 1024;
            let quality = 80;
            let compressed: Buffer | null = null;
            for (; quality >= 40; quality -= 10) {
                const candidate = await sharp(imageBuffer).rotate().webp({ quality }).toBuffer();
                if (candidate.byteLength <= MAX_BYTES) {
                    compressed = candidate;
                    break;
                }
                compressed = candidate; // keep last attempt even if > MAX_BYTES
            }
            const uploadBytes = new Uint8Array(compressed!);
            const safeName = imageFile.name?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
            const baseName = safeName.replace(/\.[^.]+$/, '');
            const filePath = `public/${Date.now()}_${baseName}.webp`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, uploadBytes, { contentType: 'image/webp', upsert: false });

            if (uploadError || !uploadData?.path) {
                console.error('Error uploading image:', uploadError);
                return { error: 'Failed to upload image.' };
            }

            const { data: pub } = supabase.storage
                .from('product_images')
                .getPublicUrl(uploadData.path);

            imageUrl = pub.publicUrl;
        }
    } catch (err: any) {
        console.error('Unexpected error during image upload:', err);
        return { error: err?.message || 'Unexpected error during image upload.' };
    }

    const toInsert = { name, description, price, category, image_url: imageUrl || null };
    const { error } = await supabase.from('products').insert([toInsert]);

    if (error) {
        console.error('Error creating product:', error);
        return { error: error.message || 'Failed to create product.' };
    }

    // Revalidate products page and let client handle success UX + redirect
    revalidatePath('/dashboard/products');
    return { success: true } as const;
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