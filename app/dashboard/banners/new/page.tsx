import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BannerForm } from '../BannerForm';

export default function NewBannerPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-950 p-6">
            <Card className="w-full max-w-2xl border border-green-900/40 bg-gray-950 text-white shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-green-400">
                        Add New Banner
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Upload a promotional image and set its visibility.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BannerForm />
                </CardContent>
            </Card>
        </div>
    );
}