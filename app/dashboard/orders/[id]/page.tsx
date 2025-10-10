import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default async function ViewOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch the order with customer profile and address
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`*, payment_method, profiles(full_name), addresses(*)`)
        .eq("id", id)
        .single();

    if (orderError || !order) {
        console.error("Error fetching order or order not found:", orderError?.message);
        notFound();
    }

    // Fetch order items with products
    const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select(`*, products(name, image_url)`)
        .eq("order_id", id);

    if (itemsError) {
        console.error("Error fetching order items:", itemsError.message);
    }

    const address = order.addresses;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-900/50 text-green-400 border border-green-700/50";
            case "shipped": return "bg-blue-900/50 text-blue-400 border border-blue-700/50";
            case "processing": return "bg-yellow-900/50 text-yellow-400 border border-yellow-700/50";
            case "cancelled": return "bg-red-900/50 text-red-400 border border-red-700/50";
            default: return "bg-gray-700 text-gray-300 border border-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard/orders"
                        className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to All Orders</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Items */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-black text-white mb-6">Order Details</h1>
                        <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20">
                            <ul className="divide-y divide-gray-800">
                                {orderItems?.map(item => (
                                    <li key={item.id} className="p-6 flex items-center space-x-6">
                                        {item.products?.image_url ? (
                                            <Image
                                                src={item.products.image_url}
                                                alt={item.products.name || "Product Image"}
                                                width={64}
                                                height={64}
                                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-700"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                                <Package size={32} className="text-gray-500" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-white">
                                                {item.products?.name || "Product not found"}
                                            </p>
                                            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            ₹{item.price_at_purchase.toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-bold text-white mb-6">Summary</h2>
                        <div className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20 space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Order ID</p>
                                <p className="text-sm font-mono text-white">#{order.id.substring(0, 8)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Customer</p>
                                <p className="text-lg font-semibold text-white">
                                    {order.profiles?.full_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-lg font-semibold text-white">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Payment Method</p>
                                <p className="text-lg font-semibold text-white">
                                    {order.payment_method || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Shipping Address</p>
                                {address ? (
                                    <div className="mt-2 space-y-1 text-base text-gray-300 border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                                        {address.house_no && <p><span className="font-semibold text-gray-400">House No:</span> {address.house_no}</p>}
                                        {address.street_address && <p><span className="font-semibold text-gray-400">Street:</span> {address.street_address}</p>}
                                        {address.landmark && <p><span className="font-semibold text-gray-400">Landmark:</span> {address.landmark}</p>}
                                        {address.city && <p><span className="font-semibold text-gray-400">City:</span> {address.city}</p>}
                                        {address.state && <p><span className="font-semibold text-gray-400">State:</span> {address.state}</p>}
                                        {address.postal_code && <p><span className="font-semibold text-gray-400">Pincode:</span> {address.postal_code}</p>}
                                        {address.country && <p><span className="font-semibold text-gray-400">Country:</span> {address.country}</p>}
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-300">{order.shipping_address}</p>
                                )}
                                {address?.mobile_number && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        📞 {address.mobile_number}
                                    </p>
                                )}
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <p className="text-sm text-gray-400">Status</p>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusStyles(order.status)}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                                <p className="text-xl font-bold text-white">Total</p>
                                <p className="text-2xl font-bold text-green-400">
                                    ₹{(order.total_price || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}