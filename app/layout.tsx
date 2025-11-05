import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from 'react';
import GlobalLoader from '@/components/GlobalLoader';
import NavigationLoader from '@/components/NavigationLoader';
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
          {/* Wrap children in the new provider. Use Suspense fallback so the
              GlobalLoader renders during initial server-side rendering / full
              page refresh. NavigationLoader will show the full-screen loader
              during client-side route transitions. */}
          <ProgressBarProvider>
            <Suspense fallback={<GlobalLoader />}>
              {children}

              {/* MOVED: client-side navigation loader is now INSIDE Suspense */}
              <NavigationLoader />
            </Suspense>
          </ProgressBarProvider>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}