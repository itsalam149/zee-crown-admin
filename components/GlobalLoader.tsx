import { Loader2 } from 'lucide-react';

/**
 * A full-screen loader component for the initial app load.
 */
export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center bg-black">
            {/* This loader matches your dashboard's dark theme */}
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-green-500" />
            </div>
        </div>
    );
}