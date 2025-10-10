'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const BUCKET_NAME = 'banners';

// Define the allowed category types for type safety
type BannerCategory = 'All' | 'medicine' | 'cosmetics' | 'food' | 'perfumes';

export async function createBanner(formData: FormData) {
    const supabase = createAdminClient();
    const imageFile = formData.get('image') as File;
    const sortOrder = formData.get('sort_order') as string;
    const isActive = formData.get('is_active') === 'on';
    // Also get the category from the form
    const category = formData.get('category') as BannerCategory;


    if (!imageFile || imageFile.size === 0) {
        return { error: 'Banner image is required.' };
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, imageFile);

    if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        return { error: 'Failed to upload banner image.' };
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

    const { error: dbError } = await supabase.from('banners').insert({
        image_url: publicUrlData.publicUrl,
        sort_order: parseInt(sortOrder, 10) || 0,
        is_active: isActive,
        category: category || 'All' // Set the category, defaulting to 'All'
    });

    if (dbError) {
        console.error('Database Insert Error:', dbError);
        return { error: 'Failed to save banner details.' };
    }

    revalidatePath('/dashboard/banners');
    // We will redirect from the client-side form now
    // redirect('/dashboard/banners');
}


export async function deleteBanner(id: string, imageUrl: string) {
    const supabase = createAdminClient();
    const filePath = imageUrl.split(`/${BUCKET_NAME}/`)[1];

    if (filePath) {
        const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);
        if (storageError) {
            console.error('Storage Delete Error:', storageError);
            // Return an error object
            return { error: 'Failed to delete banner image from storage.' };
        }
    }

    const { error: dbError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

    if (dbError) {
        console.error('Database Delete Error:', dbError);
        // Return an error object
        return { error: 'Failed to delete banner from database.' };
    }

    revalidatePath('/dashboard/banners');
    // Remove the redirect and return a success object
    return { success: 'Banner deleted successfully!' };
}

export async function updateBannerCategory(id: string, category: BannerCategory) {
    const supabase = await createAdminClient();
    
    const { error } = await supabase
      .from('banners')
      .update({ category: category })
      .eq('id', id);
  
    if (error) {
      console.error('Error updating banner category:', error);
      // You can return an error message to the client if needed
      return { error: 'Failed to update category.' };
    }
  
    // Revalidate the path to refresh the data on the page
    revalidatePath('/dashboard/banners');
  
    return { success: true };
}