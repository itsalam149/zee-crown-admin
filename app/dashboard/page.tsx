import { createClient } from '@/lib/supabase/server';
import { StatCard } from './StatCard';

export default async function DashboardPage() {
    const supabase = await createClient();

    const [
        { count: productCount },
        { count: orderCount },
        { count: userCount },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

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
                    <StatCard title="Total Orders" value={orderCount ?? 0} iconName="shoppingCart" description="All processed orders" />
                    <StatCard title="Total Products" value={productCount ?? 0} iconName="package" description="Active products in store" />
                    <StatCard title="Total Customers" value={userCount ?? 0} iconName="users" description="Registered users" />
                </div>
            </div>
        </div>
    );
}
