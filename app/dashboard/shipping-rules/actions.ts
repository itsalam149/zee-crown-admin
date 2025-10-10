"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateShippingRules(formData: FormData) {
    const supabase = await createClient();

    const rules = [
        {
            id: formData.get("id_1"),
            min_order_value: parseFloat(formData.get("min_order_value_1") as string),
            charge: parseFloat(formData.get("charge_1") as string),
        },
        {
            id: formData.get("id_2"),
            min_order_value: parseFloat(formData.get("min_order_value_2") as string),
            charge: parseFloat(formData.get("charge_2") as string),
        },
    ];

    for (const rule of rules) {
        const { error } = await supabase
            .from("shipping_rules")
            .update({
                min_order_value: rule.min_order_value,
                charge: rule.charge,
            })
            .eq("id", rule.id);

        if (error) {
            console.error("Error updating shipping rule:", error);
            return { error: "Failed to update shipping rules." };
        }
    }

    revalidatePath("/dashboard/shipping-rules");
    return { success: "Shipping rules updated successfully." };
}