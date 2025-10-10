import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ShippingRulesForm from "./ShippingRulesForm";

export default async function ShippingRulesPage() {
    const supabase = await createClient();
    const { data: rules, error } = await supabase
        .from("shipping_rules")
        .select("*");

    if (error) {
        console.error("Error fetching shipping rules:", error);
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>
                <h1 className="text-5xl font-black text-white mb-8">
                    Shipping Rules
                </h1>
                <ShippingRulesForm rules={rules ?? []} />
            </div>
        </div>
    );
}