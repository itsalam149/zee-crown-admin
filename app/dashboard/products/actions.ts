'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import sharp from 'sharp';
import { redirect } from 'next/navigation';

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
            // ✅ FIX: Changed quality from 80 to 70 for smaller server-side compression
            const compressed = await sharp(buffer).rotate().webp({ quality: 70 }).toBuffer();
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

    const dataToUpdate = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        mrp: parseFloat(formData.get('mrp') as string) || null,
        category: formData.get('category') as string,
    };

    let finalImageUrl = formData.get('image_url') as string;
    const imageFile = formData.get('image_file') as File | null;

    try {
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
            const oldImageUrl = formData.get('image_url') as string;
            if (oldImageUrl) {
                try {
                    const oldImagePath = oldImageUrl.split('/product_images/')[1];
                    if (oldImagePath) {
                        await supabase.storage.from('product_images').remove([oldImagePath]);
                    }
                } catch (removeError) {
                    console.warn("Could not remove old image, continuing anyway:", removeError);
                }
            }

            const buffer = Buffer.from(await imageFile.arrayBuffer());
            // ✅ FIX: Changed quality from 80 to 70 for smaller server-side compression
            const compressed = await sharp(buffer).rotate().webp({ quality: 70 }).toBuffer();
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

    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    redirect('/dashboard/products');
}

// UPDATE a product's category
export async function updateProductCategory(
    productId: string,
    newCategory: string
) {
    // ✅ FIX: Removed 'await' from sync function to prevent stuck loader
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

    // ✅ FIX: Added logic to delete the image from storage first
    try {
        // 1. Get the product's image_url
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_url')
            .eq('id', productId)
            .single();

        if (fetchError) {
            console.error("Error fetching product for deletion:", fetchError);
            // Don't stop, still try to delete the DB record
        }

        // 2. If image_url exists, delete it from storage
        if (product && product.image_url) {
            const oldImagePath = product.image_url.split('/product_images/')[1];
            if (oldImagePath) {
                const { error: storageError } = await supabase.storage
                    .from('product_images')
                    .remove([oldImagePath]);

                if (storageError) {
                    console.warn("Could not delete image from storage:", storageError.message);
                }
            }
        }

        // 3. Delete the product from the database
        const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

        if (deleteError) {
            console.error("Product Deletion Error:", deleteError);
            return { error: 'Failed to delete product.' };
        }

        revalidatePath('/dashboard/products');
        return { success: 'Product deleted successfully.' };

    } catch (err) {
        console.error("Delete Product Error:", err);
        return { error: 'An unexpected error occurred.' };
    }
}