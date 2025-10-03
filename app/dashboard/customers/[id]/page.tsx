// app/dashboard/customers/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Home, ShoppingCart } from "lucide-react";

export default async function ViewCustomerPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const customerId = params.id;

    // Fetch profile, addresses, and orders in parallel
    const [profileRes, addressesRes, ordersRes, userRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', customerId).single(),
        supabase.from('addresses').select('*').eq('user_id', customerId),
        supabase.from('orders').select('*').eq('user_id', customerId).order('created_at', { ascending: false }),
        supabase.auth.admin.getUserById(customerId) // Fetches email from auth schema
    ]);

    const { data: profile, error: profileError } = profileRes;
    const { data: addresses } = addressesRes;
    const { data: orders } = ordersRes;
    const { data: { user } } = userRes;

    if (profileError || !profile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard/customers" className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to All Customers</span>
                    </Link>
                </div>

                {/* Customer Details Card */}
                <div className="mb-12 backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-green-500/20 shadow-lg">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-black text-5xl font-bold">
                            {(profile.full_name || 'U')[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white">{profile.full_name}</h1>
                            <div className="flex items-center space-x-6 mt-2 text-gray-400">
                                <span className="flex items-center space-x-2"><Mail size={16} /><span>{user?.email || 'No email'}</span></span>
                                <span className="flex items-center space-x-2"><Phone size={16} /><span>{profile.phone_number || 'No phone'}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Addresses and Order History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3"><Home /><span>Addresses</span></h2>
                        <div className="space-y-4">
                            {addresses && addresses.length > 0 ? addresses.map(addr => (
                                <div key={addr.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                    <p>{addr.street_address}, {addr.city}, {addr.state} - {addr.postal_code}</p>
                                    <p className="text-xs text-gray-500">{addr.country}</p>
                                </div>
                            )) : <p className="text-gray-500">No addresses found.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3"><ShoppingCart /><span>Order History</span></h2>
                        <div className="space-y-4">
                            {orders && orders.length > 0 ? orders.map(order => (
                                <div key={order.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                                    <div>
                                        <p className="font-mono text-sm text-gray-400">#{order.id.substring(0, 8)}</p>
                                        <p className="text-white">on {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-lg font-semibold text-green-400">₹{order.total_price.toFixed(2)}</p>
                                </div>
                            )) : <p className="text-gray-500">No orders found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}