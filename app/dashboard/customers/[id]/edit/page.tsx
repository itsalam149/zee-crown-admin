// app/dashboard/customers/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditCustomerForm from './EditCustomerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
    // ✅ Await the async client
    const supabase = await createClient();

    // Fetch the customer profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !profile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard/customers"
                        className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Customers</span>
                    </Link>
                </div>

                <h1 className="text-5xl font-black text-white mb-8">Edit Customer</h1>

                <EditCustomerForm profile={profile} />
            </div>
        </div>
    );
}
