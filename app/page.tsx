import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements for consistency */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/8 to-green-600/8 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content Card */}
      <main className="relative z-10 flex flex-col items-center text-center p-8 md:p-16 backdrop-blur-xl bg-black/30 rounded-2xl border border-green-500/20 shadow-2xl shadow-green-900/20 max-w-2xl">
        {/* Icon */}
        <div className="mb-6 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
          <Crown size={40} className="text-black" />
        </div>

        {/* Store Name */}
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">
          Welcome to Zee Crown
        </h1>

        {/* Details */}
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">
          Your central hub for managing products, orders, and customers. Streamline your e-commerce operations with precision and ease.
        </p>

        {/* Call to Action Button */}
        <div className="mt-12">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-green-600/20 hover:shadow-2xl hover:shadow-green-600/30 hover:-translate-y-1"
          >
            <span className="text-lg">Go to Dashboard</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}