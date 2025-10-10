// app/dashboard/customers/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, Eye, Edit } from 'lucide-react';
import DeleteCustomerButton from './DeleteCustomerButton';

export default async function CustomersPage() {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        return (
            <div className="min-h-screen bg-black p-8 flex items-center justify-center">
                <div className="bg-gray-900 border border-red-700/50 rounded-lg p-8">
                    <p className="text-red-400 font-semibold text-lg">
                        Error loading customers: {error.message}
                    </p>
                </div>
            </div>
        );
    }

    const userIds = profiles?.map(p => p.id) || [];
    const addressesMap = new Map<string, string | null>();
    const profilesMap = new Map(profiles?.map(p => [p.id, { fullName: p.full_name, phoneNumber: p.phone_number }]));


    if (userIds.length > 0) {
        const { data: addressesData } = await supabase
            .from('addresses')
            .select('user_id, mobile_number, is_default')
            .in('user_id', userIds);

        if (addressesData) {
            // Sort by is_default to prioritize the default address
            addressesData.sort((a, b) => Number(b.is_default) - Number(a.is_default));
            for (const addr of addressesData) {
                if (!addressesMap.has(addr.user_id)) {
                    addressesMap.set(addr.user_id, addr.mobile_number);
                }
            }
        }
    }


    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-6xl font-black text-white">Customers</h1>
                    <p className="text-xl text-gray-400 mt-2">
                        View and manage your customer profiles
                    </p>
                </div>

                <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-900/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-black/50 border-b border-green-500/20">
                                <tr>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Customer Name
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        View Details
                                    </th>
                                    <th className="px-10 py-6 text-left text-base font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {profiles?.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="hover:bg-green-950/20 transition-colors"
                                    >
                                        <td className="px-10 py-8 whitespace-nowrap text-xl font-medium text-white">
                                            {profile.full_name || 'N/A'}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-xl text-gray-300">
                                            {addressesMap.get(profile.id) || profilesMap.get(profile.id)?.phoneNumber || 'N/A'}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/customers/${profile.id}`}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Eye size={28} />
                                            </Link>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center space-x-6">
                                                <Link
                                                    href={`/dashboard/customers/${profile.id}/edit`}
                                                    className="text-gray-400 hover:text-green-500 transition-colors"
                                                >
                                                    <Edit size={28} />
                                                </Link>
                                                <DeleteCustomerButton customerId={profile.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {profiles?.length === 0 && (
                    <div className="text-center py-20">
                        <Users size={48} className="mx-auto text-green-500/50 mb-4" />
                        <h3 className="text-3xl font-bold text-gray-400">No Customers Found</h3>
                        <p className="text-gray-500 mt-2">
                            New customers will appear here once they sign up.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}