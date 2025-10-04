"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        // The SignOutButton from Clerk handles all the logic.
        // We pass `redirectUrl` to tell it where to send the user after they log out.
        <SignOutButton redirectUrl="/login">
            <button className="w-full group flex items-center justify-center p-3 text-lg font-semibold text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                <LogOut size={22} className="mr-3 text-red-500 group-hover:text-red-400 transition-colors" />
                <span className="transition-colors">Logout</span>
            </button>
        </SignOutButton>
    );
}