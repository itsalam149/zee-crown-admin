'use client'

// Define a type for the product data, matching your database structure
type Product = {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number;
    mrp: number | null;
    category: string;
    image_url: string | null;
};

export default function ExportButtons({ products }: { products: Product[] }) {

    const handleExportJSON = () => {
        if (!products || products.length === 0) {
            alert("No products to export.");
            return;
        }
        const jsonString = JSON.stringify(products, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        if (!products || products.length === 0) {
            alert("No products to export.");
            return;
        }

        const headers = Object.keys(products[0]);
        const csvContent = [
            headers.join(','),
            ...products.map(product =>
                headers.map(header => {
                    const value = product[header as keyof Product];
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const stringValue = String(value);
                    if (stringValue.includes(',')) {
                        return `"${stringValue}"`;
                    }
                    return stringValue;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex items-center space-x-5">
            <button
                onClick={handleExportCSV}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white font-bold py-4 px-6 rounded-lg flex items-center space-x-3 transition-colors text-lg border border-gray-700 shadow-lg shadow-gray-900/10"
            >
                <span>Export CSV</span>
            </button>
            <button
                onClick={handleExportJSON}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white font-bold py-4 px-6 rounded-lg flex items-center space-x-3 transition-colors text-lg border border-gray-700 shadow-lg shadow-gray-900/10"
            >
                <span>Export JSON</span>
            </button>
        </div>
    );
}