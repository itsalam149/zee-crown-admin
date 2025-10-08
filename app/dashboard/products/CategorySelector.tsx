// app/dashboard/products/CategorySelector.tsx
'use client';

import { useState, useTransition } from 'react';
import { updateProductCategory } from './actions';
import { Loader2 } from 'lucide-react';

const categories = ['medicine', 'cosmetics', 'food', 'perfumes'];

const getCategoryStyles = (category: string) => {
    switch (category) {
        case 'cosmetics':
            return 'bg-green-900/50 text-green-400 border border-green-700/50';
        case 'medicine':
            return 'bg-blue-900/50 text-blue-400 border border-blue-700/50';
        case 'perfumes':
            return 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50';
        case 'food':
            return 'bg-red-900/50 text-red-400 border border-red-700/50';
        default:
            return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
};

export default function CategorySelector({
    productId,
    currentCategory,
}: {
    productId: string;
    currentCategory: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        startTransition(async () => {
            await updateProductCategory(productId, newCategory);
        });
    };

    return (
        <div className="relative flex items-center">
            <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={isPending}
                aria-label="Category"
                title="Category"
                className={`w-full appearance-none cursor-pointer px-4 py-2 text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${getCategoryStyles(
                    selectedCategory
                )}`}
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900 text-white">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                ))}
            </select>
            {isPending && <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-gray-400" />}
        </div>
    );
}