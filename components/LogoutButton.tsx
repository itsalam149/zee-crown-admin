'use client'

import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-white bg-white/5 hover:bg-red-500/20 rounded-xl transition-all duration-300"
        >
            <LogOut size={16} />
            <span>Logout</span>
        </button>
    );
}