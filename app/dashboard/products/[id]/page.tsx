import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, ArrowLeft } from "lucide-react";
import DeleteProductButton from "../DeleteProductButton";

export default async function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
    // ✅ Await the params in Next.js 15+
    const { id } = await params;

    // ✅ Await the client (cookies() async fix)
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !product) {
        console.error("Error fetching product:", error);
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/8 to-green-600/8 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to All Products</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
                    {/* Left Column (Image) */}
                    <div className="md:col-span-2 backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20 shadow-2xl shadow-green-900/20">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-auto object-cover rounded-lg"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Right Column (Details) */}
                    <div className="md:col-span-3 flex flex-col h-full">
                        <div className="space-y-6">
                            <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-emerald-500/20 text-emerald-400 capitalize">
                                {product.category}
                            </span>

                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-end gap-4">
                                <p className="text-5xl font-bold text-emerald-400">
                                    ₹{Number(product.price).toFixed(2)}
                                </p>
                                {product.mrp && product.mrp > product.price && (
                                    <p className="text-2xl font-medium text-gray-500 line-through">
                                        ₹{Number(product.mrp).toFixed(2)}
                                    </p>
                                )}
                            </div>


                            <div>
                                <h2 className="text-xl font-bold text-white mb-3">
                                    About this product
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {product.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col space-y-4">
                            <Link
                                href={`/dashboard/products/${product.id}/edit`}
                                className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors text-base"
                            >
                                <Edit size={20} />
                                <span>Edit Product</span>
                            </Link>

                            <DeleteProductButton
                                productId={product.id}
                                className="w-full text-center bg-red-600/90 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors text-base"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}