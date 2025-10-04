import { createClient } from '@/lib/supabase/server';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Calendar } from 'lucide-react';
import DateRangeFilter from './DateRangeFilter';
import RevenueChart from './RevenueChart';

type PageProps = {
    searchParams: Promise<{ from?: string; to?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    // Get date range from search params or default to last 30 days
    const toDate = params.to || new Date().toISOString().split('T')[0];
    const fromDate = params.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch all data in parallel
    const [
        { data: allOrders },
        { data: filteredOrders },
        { data: products },
        { data: profiles },
        { data: orderItems },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase
            .from('orders')
            .select('*')
            .gte('created_at', fromDate)
            .lte('created_at', toDate + 'T23:59:59'),
        supabase.from('products').select('*'),
        supabase.from('profiles').select('*'),
        supabase
            .from('order_items')
            .select('*, products(name, price), orders!inner(created_at)')
            .gte('orders.created_at', fromDate)
            .lte('orders.created_at', toDate + 'T23:59:59'),
        supabase
            .from('orders')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5),
    ]);

    // Calculate metrics for filtered period
    const totalRevenue = filteredOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
    const totalOrders = filteredOrders?.length || 0;
    const activeProducts = products?.length || 0;
    const totalCustomers = profiles?.length || 0;

    // Calculate all-time metrics for comparison
    const allTimeRevenue = allOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status counts for filtered period - FIXED: Changed order_status to status
    const statusCounts = {
        pending: filteredOrders?.filter(o => o.status === 'pending').length || 0,
        paid: filteredOrders?.filter(o => o.status === 'paid').length || 0,
        processing: filteredOrders?.filter(o => o.status === 'processing').length || 0,
        shipped: filteredOrders?.filter(o => o.status === 'shipped').length || 0,
        delivered: filteredOrders?.filter(o => o.status === 'delivered').length || 0,
        cancelled: filteredOrders?.filter(o => o.status === 'cancelled').length || 0,
    };

    const completionRate = totalOrders > 0 ? (statusCounts.delivered / totalOrders) * 100 : 0;

    // Top selling products in selected period
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    orderItems?.forEach(item => {
        const productName = item.products?.name || 'Unknown';
        const existing = productSales.get(productName) || { name: productName, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity || 0;
        existing.revenue += (item.quantity || 0) * (item.products?.price || 0);
        productSales.set(productName, existing);
    });

    const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // Prepare daily revenue data for chart
    const dailyRevenue = new Map<string, number>();
    filteredOrders?.forEach(order => {
        const date = order.created_at.split('T')[0];
        dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + order.total_price);
    });

    const chartData = Array.from(dailyRevenue.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: revenue,
        }));

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/8 to-green-600/8 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto">
                {/* Header with Date Filter */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                                Dashboard Analytics
                            </h1>
                            <p className="text-green-300/80 text-xl font-medium mt-2">
                                {fromDate} to {toDate}
                            </p>
                        </div>
                        <DateRangeFilter currentFrom={fromDate} currentTo={toDate} />
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 rounded-2xl border border-green-500/20 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Period Revenue</h3>
                        <p className="text-3xl font-bold text-white mb-1">₹{totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Total: ₹{allTimeRevenue.toFixed(2)}</p>
                    </div>

                    <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-blue-400" />
                            </div>
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Orders</h3>
                        <p className="text-3xl font-bold text-white mb-1">{totalOrders}</p>
                        <p className="text-xs text-gray-500">{statusCounts.pending} pending</p>
                    </div>

                    <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 rounded-2xl border border-purple-500/20 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Package className="w-6 h-6 text-purple-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Active Products</h3>
                        <p className="text-3xl font-bold text-white mb-1">{activeProducts}</p>
                        <p className="text-xs text-gray-500">In store catalog</p>
                    </div>

                    <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/5 p-6 rounded-2xl border border-orange-500/20 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-orange-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Customers</h3>
                        <p className="text-3xl font-bold text-white mb-1">{totalCustomers}</p>
                        <p className="text-xs text-gray-500">Registered users</p>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Average Order Value</h3>
                        <p className="text-2xl font-bold text-white">₹{avgOrderValue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">Per order in period</p>
                    </div>

                    <div className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Completion Rate</h3>
                        <p className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500 mt-1">{statusCounts.delivered} delivered</p>
                    </div>

                    <div className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Products Sold</h3>
                        <p className="text-2xl font-bold text-white">
                            {orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total units</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                {chartData.length > 0 && (
                    <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-green-500/20 mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Revenue Trend</h2>
                        <RevenueChart data={chartData} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Top Selling Products */}
                    <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-green-500/20">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Package className="w-6 h-6 text-green-400" />
                            Top Selling Products
                        </h2>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? (
                                topProducts.map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.quantity} sold</p>
                                            </div>
                                        </div>
                                        <p className="text-green-400 font-semibold">₹{product.revenue.toFixed(2)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No sales in this period</p>
                            )}
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-green-500/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Order Status</h2>
                        <div className="space-y-3">
                            {Object.entries(statusCounts).map(([status, count]) => {
                                const colors = {
                                    pending: { bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-500', label: 'Pending' },
                                    paid: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500', label: 'Paid' },
                                    processing: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'Processing' },
                                    shipped: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-500', label: 'Shipped' },
                                    delivered: { bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Delivered' },
                                    cancelled: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Cancelled' },
                                };
                                const color = colors[status as keyof typeof colors];
                                return (
                                    <div key={status} className={`flex items-center justify-between p-4 ${color.bg} rounded-lg border ${color.border}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 ${color.dot} rounded-full`}></div>
                                            <span className="text-white font-medium">{color.label}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-white">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-green-500/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-green-400" />
                        Recent Orders
                    </h2>
                    <div className="space-y-3">
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-green-500/30 transition-colors">
                                    <div>
                                        <p className="text-white font-medium">{order.profiles?.full_name || 'Customer'}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()} • #{order.id.substring(0, 8)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-semibold">₹{order.total_price.toFixed(2)}</p>
                                        {/* FIXED: Changed order_status to status */}
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Pending' ? 'bg-gray-500/20 text-gray-400' :
                                                order.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                                                        order.status === 'Shipped' ? 'bg-purple-500/20 text-purple-400' :
                                                            'bg-red-500/20 text-red-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">No recent orders</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}