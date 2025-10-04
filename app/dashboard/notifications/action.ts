'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

export async function createNotification(formData: FormData) {
    const supabase = await createClient(); // ✅ Await here

    const rawFormData = {
        title: formData.get('title') as string,
        message: formData.get('message') as string,
    };

    const { error } = await supabase.from('notifications').insert([rawFormData]);

    if (error) {
        console.error('Error creating notification:', error);
        return { error: 'Failed to create notification.' };
    }

    revalidatePath('/dashboard/notifications');
    redirect('/dashboard/notifications');
}

export async function updateNotification(formData: FormData) {
    const supabase = await createClient(); // ✅ Await here
    const id = formData.get('id') as string;

    const rawFormData = {
        title: formData.get('title') as string,
        message: formData.get('message') as string,
    };

    const { error } = await supabase.from('notifications').update(rawFormData).eq('id', id);

    if (error) {
        console.error('Error updating notification:', error);
        return { error: 'Failed to update notification.' };
    }

    revalidatePath('/dashboard/notifications');
    redirect('/dashboard/notifications');
}

export async function deleteNotification(formData: FormData) {
    const supabase = await createClient(); // ✅ Await here
    const id = formData.get('notificationId') as string;

    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) {
        console.error('Error deleting notification:', error);
        return { error: 'Failed to delete notification.' };
    }

    revalidatePath('/dashboard/notifications');
    return { success: true };
}
