import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NotificationForm from '../NotificationForm';

export default function NewNotificationPage() {
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
                <h1 className="text-5xl font-black text-white mb-8">Add New Notification</h1>
                <NotificationForm />
            </div>
        </div>
    );
}
