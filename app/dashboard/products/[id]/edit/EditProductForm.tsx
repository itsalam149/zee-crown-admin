// In: app/dashboard/products/[id]/edit/EditProductForm.tsx
'use client'

import { useState, useTransition } from 'react'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import CustomSelect from '@/components/CustomSelect'
import { updateProduct } from '../../actions'
import { toast } from 'sonner'

type Product = {
    id: string
    name: string
    description: string | null
    price: number
    mrp: number | null
    category: 'medicine' | 'cosmetics' | 'food' | 'perfumes'
    image_url: string | null
}

type FormDataState = {
    name: string
    description: string
    price: string
    mrp: string
    category: Product['category']
}

// Dropdown options
const categoryOptions = [
    { value: 'medicine', label: 'Medicine' },
    { value: 'cosmetics', label: 'Cosmetics' },
    { value: 'food', label: 'Food' },
    { value: 'perfumes', label: 'Perfumes' },
]

export default function EditProductForm({ product }: { product: Product }) {
    const [formData, setFormData] = useState<FormDataState>({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        mrp: product.mrp?.toString() || '',
        category: product.category,
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isPending, startTransition] = useTransition();
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            // ✅ FIX: Compress image to 100 KB
            const options = {
                maxSizeMB: 0.1, // 100 KB
                maxWidthOrHeight: 1280,
                useWebWorker: true,
            }

            const compressedFile = await imageCompression(file, options)
            setImageFile(compressedFile)
            setUploadError(null)

            console.log(
                `Original: ${(file.size / 1024).toFixed(1)} KB → Compressed: ${(compressedFile.size / 1024).toFixed(1)} KB`
            )
        } catch (error) {
            console.error('Image compression failed:', error)
            setUploadError('Failed to compress image. Please try again.')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'price' || name === 'mrp') {
            const sanitizedValue = value.replace(/[^0-9.]/g, '')
            setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isPending) return;

        startTransition(async () => {
            setUploadError(null)

            const fd = new FormData();
            fd.append('id', product.id);
            fd.append('image_url', product.image_url || '');
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('mrp', formData.mrp);
            fd.append('category', formData.category);

            if (imageFile) {
                fd.append('image_file', imageFile);
            }

            const result = await updateProduct(fd);

            if (result?.error) {
                setUploadError(`Update Failed: ${result.error}`);
                toast.error(`Update Failed: ${result.error}`);
            } else {
                toast.success('Product updated successfully!');
                // Redirect is handled by the server action
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg shadow-green-900/20"
        >
            {/* ... (rest of the form remains the same) ... */}

            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300">
                    Product Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-300">
                        Price
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="text"
                        inputMode="decimal"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="mrp" className="block text-sm font-semibold text-gray-300">
                        MRP
                    </label>
                    <input
                        id="mrp"
                        name="mrp"
                        type="text"
                        inputMode="decimal"
                        value={formData.mrp}
                        onChange={handleChange}
                        className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-300">
                        Category
                    </label>
                    <CustomSelect
                        placeholder="Select Category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(value: string) =>
                            setFormData(prev => ({ ...prev, category: value as Product['category'] }))
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="image_file" className="block text-sm font-semibold text-gray-300">
                    Change Product Image
                </label>
                {product.image_url && !imageFile && (
                    <div className="my-4">
                        <p className="text-xs text-gray-400 mb-2">Current Image:</p>
                        <Image
                            src={product.image_url}
                            alt="Current product image"
                            width={100}
                            height={100}
                            className="rounded-lg"
                            unoptimized
                        />
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
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                >
                    {isPending ? 'Updating...' : 'Update Product'}
                </button>
            </div>
        </form>
    )
}