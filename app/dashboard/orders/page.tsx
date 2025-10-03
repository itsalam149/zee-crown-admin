import { createClient } from '@/lib/supabase/server';
import { ShoppingCart, Eye } from 'lucide-react';
import OrderStatusUpdater from './OrderStatusUpdater';
import Link from 'next/link';
import DeleteOrderButton from './DeleteOrderButton';

type OrderWithDetails = {
    id: string;
    created_at: string;
    total_price: number;
    status: string;
    customer_name: string | null;
    mobile_number: string | null;
    order_items: {
        quantity: number;
        products: { name: string | null } | null;
    }[];
};

export default async function OrdersPage() {
    const supabase = createClient();

    // Fetch orders with items + products
    const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
            id, created_at, total_price, status, user_id,
            order_items ( quantity, products ( name ) )
        `)
        .order('created_at', { ascending: false });

    if (ordersError) {
        return (
            <div className="min-h-screen bg-black p-8 flex items-center justify-center">
                <div className="bg-gray-900 border border-red-700/50 rounded-lg p-8">
                    <p className="text-red-400 font-semibold text-lg">
                        Error loading orders: {ordersError.message}
                    </p>
                </div>
            </div>
        );
    }

    let orders: OrderWithDetails[] = [];
    if (ordersData && ordersData.length > 0) {
        const userIds = [...new Set(ordersData.map(order => order.user_id).filter(Boolean))];

        // Fetch customer names
        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds as any[]);

        // Fetch mobile numbers (prefer default addresses)
        const { data: addressesData } = await supabase
            .from('addresses')
            .select('user_id, mobile_number, is_default')
            .in('user_id', userIds as any[]);

        // Create maps for quick lookup
        const profilesMap = new Map(profilesData?.map(p => [p.id, p.full_name]));
        const addressesMap = new Map(
            addressesData
                ?.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)) // put default first
                .map(addr => [addr.user_id, addr.mobile_number])
        );

        orders = ordersData.map(order => ({
            id: order.id,
            created_at: order.created_at,
            total_price: order.total_price,
            status: order.status,
            order_items: order.order_items as any,
            customer_name: profilesMap.get(order.user_id) || 'N/A',
            mobile_number: addressesMap.get(order.user_id) || null
        }));
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-6xl font-black text-white">Orders</h1>
                    <p className="text-xl text-gray-400 mt-2">
                        View and manage customer orders
                    </p>
                </div>

                <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-black/50 border-b border-green-500/20">
                                <tr>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Mobile
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-green-950/20 transition-colors">
                                        {/* Customer Info */}
                                        <td className="px-10 py-8 align-top">
                                            <div className="text-xl font-medium text-white mb-1">
                                                {order.customer_name}
                                            </div>
                                            <div className="text-sm font-mono text-gray-400 mb-3">
                                                #{order.id.substring(0, 8)}...
                                            </div>
                                            <ul className="space-y-1 text-gray-400 list-disc list-inside">
                                                {order.order_items?.map((item, index) => (
                                                    <li key={index} className="text-sm">
                                                        {item.quantity} × {item.products?.name || 'Item'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>

                                        {/* Mobile */}
                                        <td className="px-10 py-8 whitespace-nowrap text-lg text-gray-300 align-top">
                                            {order.mobile_number ? (
                                                <span className="font-mono text-green-400">{order.mobile_number}</span>
                                            ) : (
                                                <span className="text-gray-500">N/A</span>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300 align-top">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>

                                        {/* Total */}
                                        <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300 font-semibold align-top">
                                            ₹{order.total_price.toFixed(2)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-10 py-8 whitespace-nowrap align-top">
                                            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-10 py-8 whitespace-nowrap align-top">
                                            <div className="flex items-center space-x-6">
                                                <Link
                                                    href={`/dashboard/orders/${order.id}`}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Eye size={28} />
                                                </Link>
                                                <DeleteOrderButton orderId={order.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <ShoppingCart size={64} className="mx-auto mb-6 opacity-50" />
                        <p className="text-2xl">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
