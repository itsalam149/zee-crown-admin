'use client'

import { Fragment, useState } from 'react'
import CustomSelect from '@/components/CustomSelect'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createProduct } from '../actions'
import { Dialog, Transition } from '@headlessui/react'
import imageCompression from 'browser-image-compression'

const categoryOptions = [
    { value: 'medicine', label: 'Medicine' },
    { value: 'cosmetics', label: 'Cosmetics' },
    { value: 'food', label: 'Food' },
    { value: 'perfumes', label: 'Perfumes' },
]

type Category = (typeof categoryOptions)[number]['value']

export default function NewProductPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState<Category>('medicine')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // ✅ Handle file selection + compression
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            // Compress image to around 250 KB
            const options = {
                maxSizeMB: 0.25, // 250 KB
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

    return (
        <>
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
                        action={async (formData: FormData) => {
                            if (!imageFile) {
                                setUploadError('Please select an image for the product.')
                                return
                            }

                            setIsSubmitting(true)
                            formData.set('name', name)
                            formData.set('description', description)
                            formData.set('price', price)
                            formData.set('category', category)
                            formData.set('image_file', imageFile)

                            const result = await createProduct(formData)
                            if (result?.error) {
                                setUploadError(`Operation Failed: ${result.error}`)
                                setIsSubmitting(false)
                                return
                            }

                            setShowSuccess(true)
                            setTimeout(() => {
                                window.location.href = '/dashboard/products'
                            }, 1200)
                        }}
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
                            {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
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

            {/* ✅ Success Modal */}
            <Transition appear show={showSuccess} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black/60 p-6 text-left align-middle shadow-xl transition-all border border-emerald-500/30">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white">
                                        Product Uploaded
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-emerald-300">
                                            Your product has been uploaded successfully.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none"
                                            onClick={() => {
                                                window.location.href = '/dashboard/products'
                                            }}
                                        >
                                            View Products
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
