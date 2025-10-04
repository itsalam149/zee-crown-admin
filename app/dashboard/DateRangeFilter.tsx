'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

type Props = {
    currentFrom: string;
    currentTo: string;
};

export default function DateRangeFilter({ currentFrom, currentTo }: Props) {
    const router = useRouter();
    const [from, setFrom] = useState(currentFrom);
    const [to, setTo] = useState(currentTo);

    const handleFilter = () => {
        const params = new URLSearchParams();
        params.set('from', from);
        params.set('to', to);
        router.push(`/dashboard?${params.toString()}`);
    };

    const setPreset = (days: number) => {
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setFrom(fromDate);
        setTo(toDate);
        const params = new URLSearchParams();
        params.set('from', fromDate);
        params.set('to', toDate);
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">Date Range</h3>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">From</label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">To</label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handleFilter}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Apply Filter
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setPreset(7)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors"
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setPreset(30)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors"
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setPreset(90)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors"
                    >
                        90 Days
                    </button>
                </div>
            </div>
        </div>
    );
}