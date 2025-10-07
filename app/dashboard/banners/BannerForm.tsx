'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createBanner } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function BannerForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
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
            action={handleSubmit}
            className="grid gap-6 transform scale-110 max-w-2xl mx-auto bg-black/40 border border-green-900/50 p-8 rounded-2xl shadow-2xl shadow-green-900/30"
        >
            <div className="grid gap-3">
                <Label htmlFor="image">Banner Image</Label>
                <Input id="image" name="image" type="file" required />
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
