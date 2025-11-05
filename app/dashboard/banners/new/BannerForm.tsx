'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createBanner } from '../actions'; // Adjusted path to parent actions file
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

// Define the available categories
const categories = ['All', 'medicine', 'cosmetics', 'food', 'perfumes'];

export function BannerForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 0.1, // 100 KB
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);
            setImageFile(compressedFile);
            setUploadError(null);
        } catch (error) {
            console.error('Image compression failed:', error);
            setUploadError('Failed to compress image. Please try again.');
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isPending || !imageFile) {
            if (!imageFile) {
                setUploadError('Please select an image for the banner.');
            }
            return;
        }

        const formData = new FormData(event.currentTarget);
        formData.set('image', imageFile);

        startTransition(async () => {
            const result = await createBanner(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Banner created successfully!');
                // Redirect back to the banners list after a short delay
                setTimeout(() => router.push('/dashboard/banners'), 1200);
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-6"
        >
            {/* Banner Image Input */}
            <div className="grid gap-3">
                <Label htmlFor="image">Banner Image</Label>
                <Input id="image" name="image" type="file" required onChange={handleFileChange} />
                {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
            </div>

            {/* Category Select Dropdown */}
            <div className="grid gap-3">
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    name="category"
                    aria-label="Category"
                    className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    defaultValue="All"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort Order Input */}
            <div className="grid gap-3">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" name="sort_order" type="number" defaultValue="0" placeholder="e.g., 0, 1, 2..." />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-3">
                <Checkbox id="is_active" name="is_active" defaultChecked />
                <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Set banner as active
                </Label>
            </div>

            <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending || !imageFile}>
                    {isPending ? 'Saving...' : 'Save Banner'}
                </Button>
            </div>
        </form>
    );
}