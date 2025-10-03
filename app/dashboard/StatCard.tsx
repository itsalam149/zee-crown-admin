'use client'

import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const Icon = ({ name }: { name: string }) => {
    const iconClass = "w-8 h-8 text-green-400";
    switch (name) {
        case 'dollarSign': return <DollarSign className={iconClass} />;
        case 'shoppingCart': return <ShoppingCart className={iconClass} />;
        case 'package': return <Package className={iconClass} />;
        case 'users': return <Users className={iconClass} />;
        default: return null;
    }
};

export function StatCard({ title, value, iconName, description }: { title: string; value: string | number; iconName: string; description: string; }) {
    return (
        <div className="backdrop-blur-lg bg-black/30 p-6 rounded-2xl border border-green-500/20 shadow-lg shadow-green-900/20 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <p className="text-base font-medium text-gray-400 mb-1">{title}</p>
                    <h3 className="text-4xl font-bold text-white">{value}</h3>
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-gray-700">
                    <Icon name={iconName} />
                </div>
            </div>
        </div>
    );
}