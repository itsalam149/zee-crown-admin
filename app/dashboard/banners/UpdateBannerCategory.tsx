'use client';

import { useState, useTransition } from 'react';
import { updateBannerCategory } from './actions';

type BannerCategory = 'All' | 'medicine' | 'cosmetics' | 'food' | 'perfumes';
const categories: BannerCategory[] = ['All', 'medicine', 'cosmetics', 'food', 'perfumes'];

interface Props {
    id: string;
    currentCategory: BannerCategory;
    onUpdate: (id: string, newCategory: BannerCategory) => void;
}

// Define the color mapping inside the component
const categoryColors: Record<BannerCategory, string> = {
    All: 'bg-gray-200 text-gray-800 border-gray-300',
    medicine: 'bg-green-500 text-white border-green-400',
    cosmetics: 'bg-sky-500 text-white border-sky-400',
    food: 'bg-red-500 text-white border-red-400',
    perfumes: 'bg-amber-500 text-white border-amber-400',
};

export function UpdateBannerCategory({ id, currentCategory, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = event.target.value as BannerCategory;
        setIsEditing(false); // Close the dropdown immediately for a better feel

        startTransition(async () => {
            const result = await updateBannerCategory(id, newCategory);
            if (!result?.error) {
                // Call the parent's update function to update the state locally
                onUpdate(id, newCategory);
            }
        });
    };

    if (isEditing) {
        return (
            <select
                defaultValue={currentCategory}
                onChange={handleCategoryChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
                aria-label="Select banner category"
                title="Select banner category"
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-bold rounded-full border w-full transition-all duration-200 ${categoryColors[currentCategory]
                } ${isPending ? 'opacity-50 animate-pulse' : 'hover:opacity-80'}`}
        >
            {currentCategory}
        </button>
    );
}