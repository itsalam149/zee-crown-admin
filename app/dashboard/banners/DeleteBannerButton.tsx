'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react'; // Import Loader2 for pending state
import { deleteBanner } from './actions';
import { useTransition } from 'react';

export function DeleteBannerButton({
    id,
    imageUrl,
}: {
    id: string;
    imageUrl: string;
}) {
    const [isPending, startTransition] = useTransition();

    const handleClick = async () => {
        if (confirm('Are you sure you want to delete this banner?')) {
            startTransition(async () => {
                await deleteBanner(id, imageUrl);
            });
        }
    };

    return (
        <Button
            size="icon"
            variant="outline"
            onClick={handleClick}
            disabled={isPending}
            // Added className for styling
            className="bg-black text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
        </Button>
    );
}