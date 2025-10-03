'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import CustomSelect from '@/components/CustomSelect'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createProduct } from '../actions'

const categoryOptions = [
    { value: 'medicine', label: 'Medicine' },
    { value: 'cosmetics', label: 'Cosmetics' },
    { value: 'food', label: 'Food' },
    { value: 'perfumes', label: 'Perfumes' },
]

type Category = (typeof categoryOptions)[number]['value']

export default function NewProductPage() {
    const supabase = createClient()

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category>('medicine');
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImageFile(e.target.files[0])
            setUploadError(null)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageFile) {
            setUploadError('Please select an image for the product.')
            return
        }
        setIsSubmitting(true)
        setUploadError(null)

        try {
            const options = {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(imageFile, options)

            const filePath = `public/${Date.now()}_${compressedFile.name}`
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from('product_images')
                .upload(filePath, compressedFile)

            if (uploadErr || !uploadData?.path) {
                throw uploadErr ?? new Error('File upload failed')
            }

            const { data: urlData } = supabase.storage
                .from('product_images')
                .getPublicUrl(uploadData.path)

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('image_url', urlData.publicUrl);

            const result = await createProduct(formData);

            if (result?.error) {
                throw new Error(result.error);
            }

        } catch (err: any) {
            setUploadError(`Operation Failed: ${err.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Products</span>
                    </Link>
                </div>

                <h1 className="text-5xl font-black text-white mb-8">Add New Product</h1>
                <form
                    onSubmit={handleCreate}
                    className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg shadow-green-900/20"
                >
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-300">
                            Product Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                                placeholder="e.g., 1250.50"
                                className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-300">
                                Category
                            </label>
                            <CustomSelect
                                placeholder="Select Category"
                                options={categoryOptions}
                                value={category}
                                onChange={(value) => setCategory(value as Category)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_file" className="block text-sm font-semibold text-gray-300">
                            Product Image
                        </label>
                        <input
                            id="image_file"
                            name="image_file"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-300 hover:file:bg-emerald-500/20 cursor-pointer"
                            required
                        />
                        {uploadError && (
                            <p className="text-sm text-red-400 mt-2">{uploadError}</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}