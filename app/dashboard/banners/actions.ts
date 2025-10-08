'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
// Remove the redirect import as we will handle it on the client
// import { redirect } from 'next/navigation';

const BUCKET_NAME = 'banners';

// createBanner function remains the same...
export async function createBanner(formData: FormData) {
    const supabase = createAdminClient();
    const imageFile = formData.get('image') as File;
    const sortOrder = formData.get('sort_order') as string;
    const isActive = formData.get('is_active') === 'on';

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