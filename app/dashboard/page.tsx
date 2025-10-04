// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { StatCard } from './StatCard';
import Image from 'next/image';
import Link from 'next/link';

export default async function DashboardPage() {
    // Await the server-side Supabase client
    const supabase = await createClient();

    // Fetch data using Promise.all
    const [
        { count: productCount },
        { count: orderCount },
        { data: revenueData },
        { count: userCount },
        { data: recentOrders, error: recentOrdersError },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price').not('status', 'eq', 'cancelled'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders')
            .select('id, total_price, status, created_at, profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5),
    ]);

    const totalRevenue = revenueData?.reduce((acc, order) => acc + (order.total_price || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/8 to-green-600/8 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">
                        Dashboard Overview
                    </h1>
                    <p className="text-green-300/80 text-xl font-medium mt-4 opacity-90">
                        Your business insights at a glance
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
                    <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} iconName="dollarSign" description="All-time sales" />
                    <StatCard title="Total Orders" value={orderCount ?? 0} iconName="shoppingCart" description="All processed orders" />
                    <StatCard title="Total Products" value={productCount ?? 0} iconName="package" description="Active products in store" />
                    <StatCard title="Total Customers" value={userCount ?? 0} iconName="users" description="Registered users" />
                </div>

                {/* --- Recent Orders Table Section --- */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                            Recent Orders
                        </h2>
                    </div>
                    <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-black/50 border-b border-green-500/20">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-8 py-5 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {recentOrders?.map((order) => (
                                        <tr key={order.id} className="hover:bg-green-950/20 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold text-base mr-4">
                                                        {(order.profiles?.full_name ?? 'N')[0]}
                                                    </div>
                                                    <span className="font-semibold text-white">
                                                        {order.profiles?.full_name ?? 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    order.status === 'shipped' ? 'bg-sky-500/20 text-sky-400' :
                                                        order.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-400 whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5 text-right whitespace-nowrap">
                                                <span className="text-lg font-bold text-white">
                                                    ₹{order.total_price.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {recentOrders?.length === 0 && (
                                <div className="text-center py-16">
                                    <h3 className="text-xl font-bold text-gray-500">No Recent Orders</h3>
                                    <p className="text-gray-600 mt-2">New orders will appear here once they are placed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
