'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createBanner } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

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
                maxSizeMB: 0.5, // 500 KB
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
                toast.success('Banner uploaded successfully!');
                setTimeout(() => router.push('/dashboard/banners'), 1200);
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-6"
        >
            <div className="grid gap-3">
                <Label htmlFor="image">Banner Image</Label>
                <Input id="image" name="image" type="file" required onChange={handleFileChange} />
                {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
            </div>

            <div className="flex items-center gap-3">
                <Checkbox id="is_active" name="is_active" defaultChecked />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Banner'}
                </Button>
            </div>
        </form>
    );
}