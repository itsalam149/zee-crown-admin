'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import CustomSelect from '@/components/CustomSelect'; // Using the custom dropdown

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: 'medicine' | 'cosmetics' | 'food' | 'perfumes';
    image_url: string | null;
};

// Define the options for the dropdown
const categoryOptions = [
    { value: "medicine", label: "Medicine" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "food", label: "Food" },
    { value: "perfumes", label: "Perfumes" },
];

export default function EditProductForm({ product }: { product: Product }) {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(), // Use string for text input
        category: product.category,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setUploadError(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'price') {
            const sanitizedValue = value.replace(/[^0-9.]/g, '');
            setFormData((prev) => ({ ...prev, price: sanitizedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadError(null);
        let finalImageUrl = product.image_url;

        try {
            if (imageFile) {
                if (product.image_url) {
                    const oldImagePath = product.image_url.substring(product.image_url.lastIndexOf('/') + 1);
                    if (oldImagePath) {
                        await supabase.storage.from('product_images').remove([`public/${oldImagePath}`]);
                    }
                }

                const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1280, useWebWorker: true };
                const compressedFile = await imageCompression(imageFile, options);
                const filePath = `public/${Date.now()}_${compressedFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('product_images')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                finalImageUrl = supabase.storage.from('product_images').getPublicUrl(uploadData.path).data.publicUrl;
            }

            const dataToUpdate = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                image_url: finalImageUrl
            };

            const { error: updateError } = await supabase
                .from('products')
                .update(dataToUpdate)
                .eq('id', product.id);

            if (updateError) throw updateError;

            alert('Product updated successfully!');
            router.push('/dashboard/products');
            router.refresh();

        } catch (error: any) {
            setUploadError(`Update Failed: ${error.message}`);
            alert(`Error updating product: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg shadow-green-900/20">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300">Product Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-300">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-300">Price</label>
                    <input id="price" name="price" type="text" inputMode="decimal" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-300">Category</label>
                    <CustomSelect
                        placeholder="Select Category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="image_file" className="block text-sm font-semibold text-gray-300">Change Product Image</label>
                {product.image_url && !imageFile && (
                    <div className="my-4">
                        <p className="text-xs text-gray-400 mb-2">Current Image:</p>
                        <Image src={product.image_url} alt="Current product image" width={100} height={100} className="rounded-lg" />
                    </div>
                )}
                <input
                    id="image_file"
                    name="image_file"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-300 hover:file:bg-emerald-500/20 cursor-pointer"
                />
                {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500">
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
            </div>
        </form>
    );
}