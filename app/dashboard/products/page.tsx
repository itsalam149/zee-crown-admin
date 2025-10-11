// app/dashboard/products/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Eye } from 'lucide-react';
import ProductFilters from './ProductFilters';
import DeleteProductButton from './DeleteProductButton';
import ExportButtons from './ExportButtons';
import CategorySelector from './CategorySelector'; // <-- Import the new component

type Product = {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number;
    mrp: number | null;
    category: string;
    image_url: string | null;
};

// Helper function to truncate text
const truncate = (text: string, length: number) => {
    if (text.length <= length) {
        return text;
    }
    return text.substring(0, length) + '...';
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; sortBy?: string }>;
}) {
    const safeParams = await searchParams;

    const query = safeParams?.q ?? '';
    const category = safeParams?.category ?? '';
    const sortBy = safeParams?.sortBy ?? '';

    const supabase = await createClient();

    let supabaseQuery = supabase.from('products').select('*');

    if (query) {
        supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }
    if (category) {
        supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (sortBy) {
        if (sortBy === 'price-asc' || sortBy === 'price-desc') {
            const ascending = sortBy === 'price-asc';
            supabaseQuery = supabaseQuery.order('price', { ascending });
        } else if (sortBy === 'newest') {
            supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
        }
    } else {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    }

    const { data: products, error } = await supabaseQuery;
    const typedProducts: Product[] = products || [];

    if (error) {
        return (
            <div className="min-h-screen bg-black p-8 flex items-center justify-center">
                <div className="bg-gray-900 border border-red-700/50 rounded-lg p-8">
                    <p className="text-red-400 font-semibold text-lg">
                        Error loading products: {error.message}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/8 to-green-600/8 rounded-full blur-3xl animate-pulse animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in-up">
                    <div>
                        <h1 className="text-6xl font-black text-white">Products</h1>
                        <p className="text-xl text-gray-400 mt-2">
                            Manage and view your inventory
                        </p>
                    </div>
                    <div className="flex items-center space-x-5">
                        <ExportButtons products={typedProducts} />
                        <Link
                            href="/dashboard/products/new"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-7 rounded-lg flex items-center space-x-3 transition-colors text-lg shadow-lg shadow-green-600/20"
                        >
                            <Plus size={26} />
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>

                <div className="relative z-20 animate-fade-in-up animation-delay-200">
                    <ProductFilters />
                </div>

                <div className="animate-fade-in-up animation-delay-400">
                    <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-black/50 border-b border-green-500/20">
                                    <tr>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            MRP
                                        </th>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            View
                                        </th>
                                        <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {typedProducts?.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-green-950/20 transition-colors"
                                        >
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div
                                                    className="flex items-center space-x-6 group"
                                                    title={product.name}
                                                >
                                                    {product.image_url ? (
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-16 h-16 object-cover rounded-lg border-2 border-green-900/50"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-xl font-bold text-gray-500 border-2 border-gray-700">
                                                            {product.name[0]}
                                                        </div>
                                                    )}
                                                    <span className="text-xl font-medium text-white">
                                                        {truncate(product.name, 30)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <CategorySelector
                                                    productId={product.id}
                                                    currentCategory={product.category}
                                                />
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300 font-semibold">
                                                ₹{product.price.toFixed(2)}
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300 font-semibold">
                                                ₹{product.mrp?.toFixed(2)}
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <Link
                                                    href={`/dashboard/products/${product.id}`}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Eye size={28} />
                                                </Link>
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div className="flex items-center space-x-6">
                                                    <Link
                                                        href={`/dashboard/products/${product.id}/edit`}
                                                        className="text-gray-400 hover:text-green-500 transition-colors"
                                                    >
                                                        <Edit size={28} />
                                                    </Link>
                                                    <DeleteProductButton productId={product.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {typedProducts.length === 0 && (
                    <div className="text-center py-20 animate-fade-in-up animation-delay-400">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-800/50 to-green-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl shadow-green-900/30 border border-green-600/20">
                            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-4xl">📦</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black bg-gradient-to-r from-green-400 to-green-400 bg-clip-text text-transparent mb-3">
                            No Products Found
                        </h3>
                        <p className="text-green-300/70 mb-8 text-lg">
                            Your search or filter returned no results.
                        </p>
                        <Link
                            href="/dashboard/products"
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center space-x-2 transition-colors text-base"
                        >
                            <span>Clear Filters</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="animations-global">
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes fade-in-up {
                                from { opacity: 0; transform: translateY(30px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            .animate-fade-in-up {
                                animation: fade-in-up 0.8s ease-out forwards;
                                opacity: 0;
                            }
                            .animation-delay-200 { animation-delay: 200ms; }
                            .animation-delay-400 { animation-delay: 400ms; }
                            .animation-delay-2000 { animation-delay: 2s; }
                        `,
                    }}
                />
            </div>
        </div>
    );
}