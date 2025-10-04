'use client'

import { useState } from 'react';
import { createNotification, updateNotification } from './action';

type Notification = {
    id?: string;
    title: string | null;
    message: string | null;
};

export default function NotificationForm({ notification }: { notification?: Notification }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formAction = notification?.id ? updateNotification : createNotification;

    return (
        <form
            action={async (formData) => {
                setIsSubmitting(true);
                await formAction(formData);
                setIsSubmitting(false);
            }}
            className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg"
        >
            {notification?.id && <input type="hidden" name="id" value={notification.id} />}

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-300">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={notification?.title || ''}
                    className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    defaultValue={notification?.message || ''}
                    className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600"
                >
                    {isSubmitting
                        ? notification?.id
                            ? 'Updating...'
                            : 'Creating...'
                        : notification?.id
                            ? 'Update Notification'
                            : 'Create Notification'}
                </button>
            </div>
        </form>
    );
}
