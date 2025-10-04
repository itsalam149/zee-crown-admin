// app/dashboard/notifications/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NotificationForm from '../../NotificationForm';

export default async function EditNotificationPage({
    params
}: {
    params: Promise<{ id: string }> // Changed: params is now a Promise
}) {
    const { id } = await params; // Added: await the params
    const supabase = await createClient();

    const { data: notification, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !notification) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard/notifications"
                        className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Notifications</span>
                    </Link>
                </div>
                <h1 className="text-5xl font-black text-white mb-8">Edit Notification</h1>
                <NotificationForm notification={notification} />
            </div>
        </div>
    );
}