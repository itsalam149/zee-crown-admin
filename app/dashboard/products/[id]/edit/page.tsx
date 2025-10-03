import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';
import Link from 'next/link'; // Import Link
import { ArrowLeft } from 'lucide-react'; // Import Icon

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: product, error } = await supabase.from('products').select('*').eq('id', params.id).single();
    if (error || !product) { notFound(); }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* --- BACK BUTTON ADDED HERE --- */}
                <div className="mb-8">
                    <Link href="/dashboard/products" className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Products</span>
                    </Link>
                </div>

                <h1 className="text-5xl font-black text-white mb-8">Edit Product</h1>
                <EditProductForm product={product} />
            </div>
        </div>
    );
}