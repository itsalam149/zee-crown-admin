import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// REMOVED: import { Suspense } from 'react';
// REMOVED: import GlobalLoader from '@/components/GlobalLoader';
// REMOVED: import NavigationLoader from '@/components/NavigationLoader';
import ProgressBarProvider from '@/components/ProgressBarProvider'; // progress bar provider

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
          {/* ✅ The ProgressBarProvider handles the top loading bar.
            We have removed the <Suspense> and <NavigationLoader>
          */}
          <ProgressBarProvider>
            {children}
          </ProgressBarProvider>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}