"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBagShopping } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { navItems } from "@/components/shared/sidebar/navItems";
import Typography from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar className="shadow-md">
      <SidebarContent className="relative">
        <div className="pb-20 h-full">
          <div className="py-6 px-2 flex flex-col overflow-y-auto h-full">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "font-bold text-2xl px-6 gap-2 justify-start min-h-fit hover:bg-transparent"
              )}
            >
              <FaBagShopping className="size-6 text-primary mb-1 flex-shrink-0" />
              <Typography component="span">Zee Crown</Typography>
            </Link>

            <ul className="pt-6 flex flex-col gap-y-2">
              {navItems.map((navItem, index) => (
                <li key={`nav-item-${index}`}>
                  <Link
                    onClick={isMobile ? () => setOpenMobile(false) : undefined}
                    href={navItem.url}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "relative w-full justify-start px-5 py-4 gap-x-2.5 [&_svg]:size-6 [&_svg]:flex-shrink-0 font-medium text-base focus-visible:bg-accent focus-visible:text-accent-foreground",
                      pathname === navItem.url &&
                      "bg-accent text-accent-foreground after:content-[''] after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:bg-primary after:rounded-r-lg"
                    )}
                  >
                    {navItem.icon} {navItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth removed: no logout button */}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
