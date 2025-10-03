'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelect";

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function OrderFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [status, setStatus] = useState('');

    useEffect(() => {
        setStatus(searchParams.get('status') || '');
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        status ? params.set('status', status) : params.delete('status');
        replace(`${pathname}?${params.toString()}`);
    }, [status, pathname, replace, searchParams]);

    const handleReset = () => {
        setStatus('');
        replace(pathname);
    }

    return (
        <div className="bg-[#1F2937] p-6 rounded-xl mb-10 flex flex-col md:flex-row items-center gap-6 border border-gray-700">
            <CustomSelect
                placeholder="Filter by status"
                options={statusOptions}
                value={status}
                onChange={setStatus}
            />
            <button onClick={handleReset} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg w-full md:w-auto transition-colors text-lg">
                Reset
            </button>
        </div>
    );
}