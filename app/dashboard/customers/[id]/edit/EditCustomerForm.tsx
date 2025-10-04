'use client'

import { useState } from 'react';
// Make sure this path is correct for your project structure
import { updateCustomer } from '../../actions';

type Profile = {
    id: string;
    full_name: string | null;
    phone_number: string | null;
};

export default function EditCustomerForm({ profile }: { profile: Profile }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This component now uses a form action directly
    return (
        <form
            action={async (formData) => {
                setIsSubmitting(true);
                await updateCustomer(formData);
                setIsSubmitting(false);
            }}
            className="p-8 space-y-8 backdrop-blur-lg bg-black/30 rounded-2xl border border-green-500/20 shadow-lg"
        >
            <input type="hidden" name="customerId" value={profile.id} />
            <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-semibold text-gray-300">Full Name</label>
                <input id="full_name" name="full_name" type="text" defaultValue={profile.full_name || ''} className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-300">Phone Number</label>
                <input id="phone_number" name="phone_number" type="tel" defaultValue={profile.phone_number || ''} className="w-full bg-black/30 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600">
                    {isSubmitting ? 'Updating...' : 'Update Customer'}
                </button>
            </div>
        </form>
    );
}