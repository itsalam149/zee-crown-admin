'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import sharp from 'sharp';
import { redirect } from 'next/navigation'; // <-- This import was added

// CREATE a new product
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
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const compressed = await sharp(buffer).rotate().webp({ quality: 80 }).toBuffer();
            const uploadBytes = new Uint8Array(compressed);
            const safeName = imageFile.name?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
            const filePath = `public/${Date.now()}_${safeName}.webp`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, uploadBytes, { contentType: 'image/webp', upsert: false });

            if (!uploadData || uploadError) {
                console.error("Image Upload Error:", uploadError);
                return { error: 'Failed to upload image.' };
            }
            const { data: pub } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
            imageUrl = pub.publicUrl;
        }
    } catch (err: unknown) {
        console.error("Image Processing/Upload Error:", err);
        return { error: err instanceof Error ? err.message : 'Unexpected error during image processing' };
    }

    const { error } = await supabase.from('products').insert([{ name, description, price, mrp, category, image_url: imageUrl || null }]);
    if (error) {
        console.error("Product Creation Error:", error);
        return { error: error.message || 'Failed to create product.' };
    }
    revalidatePath('/dashboard/products');
    return { success: true } as const;
}

// UPDATE a product
export async function updateProduct(formData: FormData) {
    const supabase = createAdminClient();
    const id = formData.get('id') as string;

    if (!id) {
        return { error: 'Product ID is missing.' };
    }

    // Get product data from the form
    const dataToUpdate = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        mrp: parseFloat(formData.get('mrp') as string) || null,
        category: formData.get('category') as string,
    };

    let finalImageUrl = formData.get('image_url') as string; // Get existing URL from hidden input
    const imageFile = formData.get('image_file') as File | null;

    try {
        // 1. Check if a new image was uploaded
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {

            // 2. Delete the old image from storage, if it exists
            const oldImageUrl = formData.get('image_url') as string;
            if (oldImageUrl) {
                try {
                    // Extract the path from the full URL to delete from storage
                    const oldImagePath = oldImageUrl.split('/product_images/')[1];
                    if (oldImagePath) {
                        await supabase.storage.from('product_images').remove([oldImagePath]);
                    }
                } catch (removeError) {
                    console.warn("Could not remove old image, continuing anyway:", removeError);
                }
            }

            // 3. Upload the new image (logic from your createProduct action)
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const compressed = await sharp(buffer).rotate().webp({ quality: 80 }).toBuffer();
            const uploadBytes = new Uint8Array(compressed);
            const safeName = imageFile.name?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
            const filePath = `public/${Date.now()}_${safeName}.webp`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, uploadBytes, { contentType: 'image/webp', upsert: false });

            if (!uploadData || uploadError) {
                console.error("Image Upload Error:", uploadError);
                return { error: 'Failed to upload new image.' };
            }
            const { data: pub } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
            finalImageUrl = pub.publicUrl;
        }

        // 4. Update the product record in the database
        const { error: updateError } = await supabase
            .from('products')
            .update({
                ...dataToUpdate,
                image_url: finalImageUrl || null
            })
            .eq('id', id);

        if (updateError) {
            console.error("Product Update Error:", updateError);
            return { error: updateError.message || 'Failed to update product.' };
        }

    } catch (err: unknown) {
        console.error("Update Product Error:", err);
        const message = err instanceof Error ? err.message : 'Unexpected error';
        return { error: message };
    }

    // 5. Revalidate paths and redirect
    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    redirect('/dashboard/products'); // Redirect back to the products list
}

// UPDATE a product's category
export async function updateProductCategory(
    productId: string,
    newCategory: string
) {
    //
    // ✅ ******** THE FIX IS HERE ********
    // Removed 'await' before createAdminClient()
    //
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('products')
        .update({ category: newCategory })
        .eq('id', productId);

    if (error) {
        console.error('Error updating category:', error);
        return { error: 'Failed to update category.' };
    }

    revalidatePath('/dashboard/products');
    return { success: true };
}

// DELETE a product
export async function deleteProduct(productId: string) {
    const supabase = createAdminClient();
    if (!productId) return { error: 'Product ID missing' };
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
        console.error("Product Deletion Error:", error);
        return { error: 'Failed to delete product.' };
    }
    revalidatePath('/dashboard/products');
    return { success: 'Product deleted successfully.' };
}