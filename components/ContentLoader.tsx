import { Loader2 } from 'lucide-react';

/**
 * A loader for the main content area, shown during route transitions.
 */
export default function ContentLoader() {
    return (
        <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
            <Loader2 size={40} className="animate-spin text-green-500" />
        </div>
    );
}