// app/dashboard/notifications/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit, Bell } from 'lucide-react';
import DeleteNotificationButton from './DeleteNotificationButton';

export default async function NotificationsPage() {
    // ✅ Await the async Supabase client
    const supabase = await createClient();

    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-400">Error loading notifications: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-6xl font-black text-white">Notifications</h1>
                        <p className="text-xl text-gray-400 mt-2">Manage site-wide user notifications</p>
                    </div>
                    <Link
                        href="/dashboard/notifications/new"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-7 rounded-lg flex items-center space-x-3 text-lg shadow-lg shadow-green-600/20"
                    >
                        <Plus size={26} />
                        <span>Add Notification</span>
                    </Link>
                </div>

                <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-black/50 border-b border-green-500/20">
                                <tr>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {notifications?.map((notification) => (
                                    <tr key={notification.id} className="hover:bg-green-950/20 transition-colors">
                                        <td className="px-10 py-8 text-xl font-medium text-white align-top">
                                            {notification.title}
                                        </td>
                                        <td className="px-10 py-8 text-lg text-gray-400 max-w-lg align-top">
                                            {notification.message}
                                        </td>
                                        <td className="px-10 py-8 text-lg text-gray-300 align-top">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap align-top">
                                            <div className="flex items-center space-x-6">
                                                <Link
                                                    href={`/dashboard/notifications/${notification.id}/edit`}
                                                    className="text-gray-400 hover:text-green-500 transition-colors"
                                                >
                                                    <Edit size={28} />
                                                </Link>
                                                <DeleteNotificationButton notificationId={notification.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {notifications?.length === 0 && (
                    <div className="text-center py-20">
                        <Bell size={48} className="mx-auto text-green-500/50 mb-4" />
                        <h3 className="text-3xl font-bold text-gray-400">No Notifications Found</h3>
                        <p className="text-gray-500 mt-2">Create a notification to display to your users.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
