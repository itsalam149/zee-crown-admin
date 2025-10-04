"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Handle redirect after successful sign in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Force a hard redirect to ensure clean state
      window.location.href = "/dashboard";
    }
  }, [isLoaded, isSignedIn]);

  // Force re-check of auth state after potential OAuth callback
  useEffect(() => {
    const checkAuthAfterCallback = () => {
      // Force Clerk to re-check auth state
      if (
        window.location.search.includes("__clerk_status") ||
        window.location.hash.includes("access_token")
      ) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    checkAuthAfterCallback();
  }, []);

  // Show loading while checking auth state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render login form if already signed in
  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in with your Google account to continue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <SignIn
            path="/login"
            routing="path"
            appearance={{
              baseTheme: undefined,
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
                socialButtonsBlockButtonText: "font-medium",
                formFieldInput:
                  "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                footerAction: "hidden",
                footerActionText: "hidden",
                footerActionLink: "hidden",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
            signUpUrl="/login"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Only authorized users can access this application
          </p>
        </div>
      </div>
    </div>
  );
}
