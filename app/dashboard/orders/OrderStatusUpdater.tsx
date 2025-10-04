'use client'

import { useState, useTransition } from 'react';
import { updateOrderStatus } from './actions';

// Helper function for status badge colors
const getStatusStyles = (status: string) => {
    switch (status) {
        case 'delivered': return 'bg-green-900/50 text-green-400 border-green-700/50';
        case 'shipped': return 'bg-blue-900/50 text-blue-400 border-blue-700/50';
        case 'processing': return 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50';
        case 'cancelled': return 'bg-red-900/50 text-red-400 border-red-700/50';
        case 'paid': return 'bg-purple-900/50 text-purple-400 border-purple-700/50';
        case 'pending': return 'bg-gray-800 text-gray-300 border-gray-600';
        default: return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
};

export default function OrderStatusUpdater({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState(currentStatus); // ✅ Local state to track status

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus); // ✅ Update color immediately

        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('newStatus', newStatus);

        startTransition(() => {
            updateOrderStatus(formData);
        });
    };

    return (
        <select
            value={status}
            onChange={handleStatusChange}
            disabled={isPending}
            title="Order Status"
            aria-label="Order Status"
            className={`px-4 py-2 text-sm font-semibold rounded-full capitalize border outline-none focus:ring-2 focus:ring-green-400 transition-all ${getStatusStyles(status)} ${isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
        </select>
    );
}
