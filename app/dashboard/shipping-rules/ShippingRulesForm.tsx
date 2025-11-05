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
    const [localRules, setLocalRules] = useState(rules);

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

    const sortedRules = [...localRules].sort((a, b) => a.min_order_value - b.min_order_value);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-5 bg-gray-900/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                    Shipping Rules Configuration
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Define the charges and thresholds for your shipping policy. The first rule applies a fixed
                    delivery charge for all orders. The second rule sets a minimum order value for free shipping.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {sortedRules.map((rule, index) => {
                    const originalIndex = localRules.findIndex(r => r.id === rule.id);
                    const isFirstRule = index === 0;

                    return (
                        <div
                            key={rule.id}
                            className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 shadow-sm"
                        >
                            <input type="hidden" name={`id_${originalIndex + 1}`} value={rule.id} />
                            <input
                                type="hidden"
                                name={`is_active_${originalIndex + 1}`}
                                value="true"
                            />

                            {isFirstRule && (
                                <input
                                    type="hidden"
                                    name={`min_order_value_${originalIndex + 1}`}
                                    value="0"
                                />
                            )}
                            {!isFirstRule && (
                                <input
                                    type="hidden"
                                    name={`charge_${originalIndex + 1}`}
                                    value="0"
                                />
                            )}

                            <h3 className="text-xl font-semibold text-white mb-4">
                                {isFirstRule ? "Standard Shipping" : "Free Shipping"}
                            </h3>

                            <div className="max-w-md">
                                {isFirstRule ? (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor={`charge_${originalIndex + 1}`}
                                            className="block text-sm font-medium text-gray-300"
                                        >
                                            Shipping Charge (applies to all orders)
                                        </label>
                                        <input
                                            id={`charge_${originalIndex + 1}`}
                                            name={`charge_${originalIndex + 1}`}
                                            type="number"
                                            step="1"
                                            min="0"
                                            defaultValue={rule.charge}
                                            placeholder="e.g., 40"
                                            className="w-full bg-gray-900 border border-gray-700 text-white text-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor={`min_order_value_${originalIndex + 1}`}
                                            className="block text-sm font-medium text-gray-300"
                                        >
                                            Minimum Order Value for Free Shipping
                                        </label>
                                        <input
                                            id={`min_order_value_${originalIndex + 1}`}
                                            name={`min_order_value_${originalIndex + 1}`}
                                            type="number"
                                            step="1"
                                            min="0"
                                            defaultValue={rule.min_order_value}
                                            placeholder="e.g., 500"
                                            className="w-full bg-gray-900 border border-gray-700 text-white text-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="p-5 bg-gray-900/50 border border-gray-700 rounded-xl">
                    <h4 className="font-semibold text-white mb-2">Example Preview</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>
                            • Cart value ₹300 → Customer pays ₹{sortedRules[0]?.charge || 0} shipping
                        </p>
                        <p>
                            • Cart value ₹{sortedRules[1]?.min_order_value || 500} or more → Free shipping
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setLocalRules(rules)}
                            className="flex-1 px-6 py-4 font-semibold text-base text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-8 py-4 font-semibold text-base text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Rules"}
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Changes take effect immediately after saving.
                    </p>
                </div>
            </form>
        </div>
    );
}
