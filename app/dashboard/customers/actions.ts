'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCustomer(formData: FormData) {
    const supabase = createClient();
    const customerId = formData.get('customerId') as string;

    const dataToUpdate = {
        full_name: formData.get('full_name') as string,
        phone_number: formData.get('phone_number') as string,
    };

    const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', customerId);

    if (error) {
        console.error("Error updating customer:", error);
        return { error: 'Failed to update customer.' };
    }

    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${customerId}`);
    redirect(`/dashboard/customers`);
}

export async function deleteCustomer(formData: FormData) {
    const supabase = createClient();
    const customerId = formData.get('customerId') as string;

    if (!customerId) {
        return { error: 'Customer ID is missing.' };
    }

    // Deletes from auth.users, which will cascade delete the profile
    const { error: authError } = await supabase.auth.admin.deleteUser(customerId);

    if (authError) {
        console.error("Error deleting auth user:", authError);
        // Fallback to deleting just the profile if auth deletion fails (e.g., permissions)
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', customerId);
        if (profileError) {
            console.error("Error deleting customer profile:", profileError);
            return { error: 'Failed to delete customer.' };
        }
    }

    revalidatePath('/dashboard/customers');
    return { success: 'Customer deleted successfully.' };
}