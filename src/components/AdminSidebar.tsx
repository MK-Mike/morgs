"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import UserAccountButtons from "./UserAccountButtons";
import { useUser } from "@clerk/nextjs";
import { getUserRole } from "@/server/models/users";
import { navConfig } from "@/config/nav";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

const topLinks = navConfig.adminNav;

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!user) return;
        const userRole = await getUserRole(user.id);
        if (userRole === "admin") setIsAdmin(true);
      } catch (err) {
        console.log(err);
      }
    };
    void fetchUserRole();
  }, [setIsAdmin, user]);

  const pathname = usePathname();
  if (!isAdmin) {
    return <div>You are not an admin</div>;
  }

  return (
    <div className="bg-surface flex h-[calc(100vh-28px)] w-64 flex-col justify-between border-r border-secondary p-4">
      <ScrollArea className="flex-1 overflow-auto">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/sectors`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to app
          </Link>
        </Button>
        {/* Top Section */}
        <nav className="mb-6 mt-6">
          <ul className="space-y-2">
            {topLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center rounded p-2 transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-text hover:bg-secondary hover:text-white",
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {/* User Account Section */}
      <UserAccountButtons />
    </div>
  );
}
