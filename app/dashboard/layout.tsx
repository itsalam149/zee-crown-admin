'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Bell,
    Menu,
    X,
    ImageIcon, // <-- Added this import
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* --- Sidebar --- */}
            <aside
                className={`absolute h-full w-80 bg-black text-white border-r border-green-900/50 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-32 right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/8 to-green-400/8 rounded-full blur-xl animate-pulse" />
                </div>

                <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* --- Header --- */}
                    <div className="mb-10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Package size={24} className="text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">Admin Panel</h1>
                                <p className="text-green-300/80 text-sm font-medium">
                                    Zee Crown
                                </p>
                            </div>
                        </div>

                        {/* --- Close button (visible when sidebar open) --- */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-green-400 transition-transform transform hover:scale-110"
                            title="Close sidebar"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mb-6"></div>

                    {/* --- Navigation --- */}
                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <LayoutDashboard size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/products"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <Package size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Products</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/orders"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <ShoppingCart size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Orders</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/customers"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <Users size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Customers</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <Bell size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Notifications</span>
                                </Link>
                            </li>
                            {/* --- ADDED BANNERS LINK --- */}
                            <li>
                                <Link
                                    href="/dashboard/banners"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5"
                                >
                                    <ImageIcon size={22} className="mr-4 text-green-400" />
                                    <span className="font-semibold text-lg">Banners</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* --- Logout button --- */}
                    <div className="mt-auto">
                        <div className="p-4 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 overflow-y-auto relative">
                {/* --- Menu Toggle Button (visible when sidebar closed) --- */}
                {!isOpen && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="fixed top-4 left-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg shadow-green-500/30 z-50 hover:scale-110 transition-transform duration-200"
                        title="Open sidebar"
                    >
                        <Menu size={28} />
                    </button>
                )}

                <div className="p-4 md:p-6">{children}</div>
            </main>
        </div>
    );
}