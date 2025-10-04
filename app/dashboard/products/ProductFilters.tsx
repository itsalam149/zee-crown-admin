'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import CustomSelect from "@/components/CustomSelect";

const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "medicine", label: "Medicine" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "food", label: "Food" },
    { value: "perfumes", label: "Perfumes" },
];

const sortOptions = [
    { value: "", label: "Sort by" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
];

export default function ProductFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [debouncedQuery] = useDebounce(query, 300);

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
        setCategory(searchParams.get('category') || '');
        setSortBy(searchParams.get('sortBy') || '');
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) params.set('q', debouncedQuery);
        else params.delete('q');
        if (category) params.set('category', category);
        else params.delete('category');
        if (sortBy) params.set('sortBy', sortBy);
        else params.delete('sortBy');
        replace(`${pathname}?${params.toString()}`);
    }, [debouncedQuery, category, sortBy, pathname, replace, searchParams]);

    const handleReset = () => {
        setQuery('');
        setCategory('');
        setSortBy('');
        replace(pathname);
    }

    return (
        <div className="bg-black/30 backdrop-blur-lg p-6 rounded-xl mb-10 flex flex-col md:flex-row items-center gap-6 border border-green-500/20 shadow-lg shadow-green-900/10">

            <input
                type="text"
                placeholder="Search product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-black/30 border-2 border-gray-700 text-white rounded-lg w-full flex-1 px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <CustomSelect
                placeholder="Category"
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                className="w-[200px] rounded-lg transition-all duration-300"
            />

            <CustomSelect
                placeholder="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-[220px] rounded-lg transition-all duration-300"
            />

            <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg w-full md:w-auto transition-colors text-lg"
            >
                Reset
            </button>
        </div>
    );
}
