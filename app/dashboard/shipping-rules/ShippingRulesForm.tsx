"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateShippingRules } from "./actions";

type ShippingRule = {
    id: string;
    min_order_value: number;
    charge: number;
    is_active: boolean;
};

export default function ShippingRulesForm({ rules }: { rules: ShippingRule[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const result = await updateShippingRules(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(result.success);
        }

        setIsSubmitting(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg"
        >
            {rules.map((rule, index) => (
                <div key={rule.id} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <input type="hidden" name={`id_${index + 1}`} value={rule.id} />
                    <div className="space-y-2">
                        <label
                            htmlFor={`min_order_value_${index + 1}`}
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Minimum Order Value {index + 1}
                        </label>
                        <input
                            id={`min_order_value_${index + 1}`}
                            name={`min_order_value_${index + 1}`}
                            type="number"
                            defaultValue={rule.min_order_value}
                            className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor={`charge_${index + 1}`}
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Charge {index + 1}
                        </label>
                        <input
                            id={`charge_${index + 1}`}
                            name={`charge_${index + 1}`}
                            type="number"
                            defaultValue={rule.charge}
                            className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600"
                >
                    {isSubmitting ? "Updating..." : "Update Rules"}
                </button>
            </div>
        </form>
    );
}