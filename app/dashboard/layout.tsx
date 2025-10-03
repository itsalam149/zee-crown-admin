import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Truck, Bell } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Sidebar */}
            <aside className="relative w-80 bg-black text-white overflow-y-auto border-r border-green-900/50">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-32 right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/8 to-green-400/8 rounded-full blur-xl animate-pulse" />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col">
                    <div className="mb-10">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Package size={24} className="text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">Admin Panel</h1>
                                <p className="text-green-300/80 text-sm font-medium">Zee Crown</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
                    </div>
                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <li><Link href="/dashboard" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><LayoutDashboard size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Dashboard</span></Link></li>
                            <li><Link href="/dashboard/products" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><Package size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Products</span></Link></li>
                            <li><Link href="/dashboard/orders" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><ShoppingCart size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Orders</span></Link></li>
                            <li><Link href="/dashboard/customers" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><Users size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Customers</span></Link></li>
                            {/* --- NEW LINKS ADDED --- */}
                            {/* <li><Link href="/dashboard/shipping-rules" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><Truck size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Shipping</span></Link></li> */}
                            <li><Link href="/dashboard/notifications" className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"><Bell size={22} className="mr-4 text-green-400" /><span className="font-semibold text-lg">Notifications</span></Link></li>
                        </ul>
                    </nav>
                    <div className="mt-auto">
                        <div className="p-4 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
                            <LogoutButton />
                        </div>  
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}