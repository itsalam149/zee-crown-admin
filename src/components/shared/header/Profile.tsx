"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Typography from "@/components/ui/typography";
import { useUser } from "@/contexts/UserContext";

export default function Profile() {
  const { profile } = useUser();

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex ml-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar>
            <AvatarImage
              src={profile?.image_url ?? undefined}
              alt={profile?.name ?? "User avatar"}
            />
            <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent alignOffset={-10} className="flex flex-col" align="end">
          <div className="px-3 py-2">
            <Typography className="text-sm">{profile?.name || "Guest"}</Typography>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
