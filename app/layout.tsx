import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// 1. REMOVE Suspense and GlobalLoader imports
// import { Suspense } from 'react';
// import GlobalLoader from '@/components/GlobalLoader';
import ProgressBarProvider from '@/components/ProgressBarProvider'; // 2. Import the new provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zee Crown Admin",
  description: "Admin panel for Zee Crown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* 3. Wrap children in the new provider */}
          <ProgressBarProvider>
            {children}
          </ProgressBarProvider>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}