"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Info, Leaf, Home, Compass, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import routesData from "@/data/routes.json";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const topLinks = [
  { name: "About", href: "/about", icon: Info },
  { name: "Environment & Ethics", href: "/environment-ethics", icon: Leaf },
  { name: "Accommodation", href: "/accommodation", icon: Home },
  { name: "Activities", href: "/activities", icon: Compass },
  { name: "Routes", href: "/sectors", icon: MapPin },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-surface flex h-[calc(100vh-28px)] w-64 flex-col justify-between border-r border-secondary p-4">
      <ScrollArea className="flex-1 overflow-auto">
        {/* Top Section */}
        <nav className="mb-6">
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

        {/* Headlands and Sectors Accordion */}
        <Accordion type="single" collapsible className="w-full flex-grow">
          {routesData.headlands.map((headland) => (
            <AccordionItem
              value={headland.slug}
              key={headland.slug}
              className="border-b-0"
            >
              <AccordionTrigger className="hover:no-underline">
                {headland.name}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-4 space-y-2">
                  {headland.sectors.map((sector) => (
                    <li key={sector.slug}>
                      <Link
                        href={`/sectors/${sector.slug}`}
                        className={cn(
                          "block rounded p-2 transition-colors",
                          pathname.includes(sector.slug)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary",
                        )}
                      >
                        {sector.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {/* User Account Section */}
      <div className="mt-auto border-t border-border p-4 pb-8">
        <Link
          href="/account"
          className="flex items-center space-x-3 rounded p-2 hover:bg-secondary hover:text-white"
        >
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-secondary">
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-muted-foreground">View Account</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
