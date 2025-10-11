'use client';

import { createClient } from '@/lib/supabase/client'; // <-- Important: Use client
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { DeleteBannerButton } from './DeleteBannerButton';
import { UpdateBannerCategory } from './UpdateBannerCategory';
import { useEffect, useState } from 'react';

// Define the category type for type safety
type BannerCategory = 'All' | 'medicine' | 'cosmetics' | 'food' | 'perfumes';

// Local Banner type matching the fields used in this file (avoid depending on /types/supabase.ts)
interface Banner {
    id: string;
    image_url: string;
    category: 'medicine' | 'cosmetics' | 'food' | 'perfumes' | null;
    is_active: boolean;
    sort_order: number;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) {
                console.error('Supabase fetch error:', error);
                setError('Error loading banners.');
            } else {
                setBanners(data);
            }
            setLoading(false);
        };

        fetchBanners();
    }, []);

    const handleCategoryUpdate = (id: string, newCategory: BannerCategory) => {
        setBanners(currentBanners =>
            currentBanners.map(banner =>
                banner.id === id
                    ? { ...banner, category: newCategory === 'All' ? null : (newCategory as Banner['category']) }
                    : banner
            )
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-6xl font-black text-white">Banners</h1>
                        <p className="text-xl text-gray-400 mt-2">
                            Manage and view promotional banners
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/dashboard/banners/new"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-7 rounded-lg flex items-center space-x-3 transition-colors text-lg shadow-lg shadow-green-600/20"
                        >
                            <PlusCircle size={26} />
                            <span>Add Banner</span>
                        </Link>
                    </div>
                </div>

                {/* Table Section */}
                <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-black/50 border-b border-green-500/20">
                                <tr>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">Sort Order</th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-green-950/20 transition-colors">
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <Image
                                                src={banner.image_url}
                                                alt="Banner"
                                                width={160}
                                                height={90}
                                                className="w-40 h-24 object-cover rounded-lg border-2 border-green-900/50"
                                                unoptimized
                                            />
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap w-48">
                                            <UpdateBannerCategory
                                                id={banner.id}
                                                currentCategory={banner.category as BannerCategory}
                                                onUpdate={handleCategoryUpdate}
                                            />
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${banner.is_active
                                                ? 'bg-green-900/50 text-green-400 border border-green-700/50'
                                                : 'bg-gray-800/60 text-gray-400 border border-gray-700/50'
                                                }`}>
                                                {banner.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300 font-semibold">
                                            {banner.sort_order}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <DeleteBannerButton
                                                id={banner.id}
                                                imageUrl={banner.image_url}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {banners.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <h3 className="text-3xl font-bold text-gray-400">No Banners Found</h3>
                        <p className="text-gray-500 mt-2">Add a new banner to display promotions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}