'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const BUCKET_NAME = 'banners';

export async function createBanner(formData: FormData) {
    const supabase = await createClient();
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
    redirect('/dashboard/banners');
}

export async function deleteBanner(id: string, imageUrl: string) {
    const supabase = await createClient();

    const filePath = imageUrl.split(`/${BUCKET_NAME}/`)[1];

    // 🧹 Delete from Storage
    if (filePath) {
        const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);
        if (storageError) {
            console.error('Storage Delete Error:', storageError);
            return { error: 'Failed to delete banner image from storage.' };
        }
    }

    // 🧩 Ensure id is a number if your DB uses integer
    const parsedId = Number(id);
    console.log('Deleting banner with ID:', parsedId);

    const { error: dbError } = await supabase
        .from('banners')
        .delete()
        .eq('id', parsedId);

    if (dbError) {
        console.error('Database Delete Error:', dbError);
        return { error: 'Failed to delete banner from database.' };
    }

    console.log('✅ Banner deleted successfully');

    revalidatePath('/dashboard/banners');
    redirect('/dashboard/banners'); // 👈 ensures UI updates
}
