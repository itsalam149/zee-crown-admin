"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateShippingRules } from "./actions";
import { Loader2 } from 'lucide-react';

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
            <div className="mb-6 p-6 bg-gradient-to-b from-gray-900/60 to-gray-800/40 border border-gray-700 rounded-2xl">
                <h3 className="text-2xl font-extrabold text-white mb-2">
                    Shipping Rules Configuration
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Manage how shipping is applied across orders. The first rule is a flat shipping
                    charge for all orders; the second sets the minimum cart value for free shipping.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {sortedRules.map((rule, index) => {
                    const originalIndex = localRules.findIndex(r => r.id === rule.id);
                    const isFirstRule = index === 0;

                    return (
                        <div
                            key={rule.id}
                            className="p-6 rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-800/60 to-gray-900/40 shadow-lg"
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

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {isFirstRule ? "Standard Shipping" : "Free Shipping"}
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-gray-700/60 px-3 py-1 text-sm font-medium text-green-400">
                                    {isFirstRule ? 'Charge' : 'Threshold'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor={isFirstRule ? `charge_${originalIndex + 1}` : `min_order_value_${originalIndex + 1}`}
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        {isFirstRule ? 'Shipping Charge (₹)' : 'Minimum Order Value (₹)'}
                                    </label>
                                    <input
                                        id={isFirstRule ? `charge_${originalIndex + 1}` : `min_order_value_${originalIndex + 1}`}
                                        name={isFirstRule ? `charge_${originalIndex + 1}` : `min_order_value_${originalIndex + 1}`}
                                        type="number"
                                        step="1"
                                        min="0"
                                        defaultValue={isFirstRule ? rule.charge : rule.min_order_value}
                                        placeholder={isFirstRule ? 'e.g., 40' : 'e.g., 500'}
                                        className="w-full bg-gray-900 border border-gray-700 text-white text-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    />
                                </div>

                                <div className="flex sm:col-span-1 items-center justify-end">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Active</p>
                                        <p className="text-sm font-semibold text-white">Yes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="p-5 bg-gradient-to-b from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl">
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
                            className="flex-1 px-6 py-3 font-semibold text-base text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-8 py-3 font-semibold text-base text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin text-white" />
                                    Saving...
                                </>
                            ) : (
                                'Save Rules'
                            )}
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
