"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Info, MapPin, BookmarkIcon, PinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { getHeadlandsForNav } from "~/server/models/headlands";
import type { HeadlandNavData } from "~/server/models/headlands";
import UserAccountButtons from "./UserAccountButtons";

const topLinks = [
  { name: "About", href: "/about", icon: Info },
  { name: "Routes", href: "/sectors", icon: MapPin },
];

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routesData, setRoutesData] = useState<HeadlandNavData[]>([]);
  const [bookmarked, setBookmarked] = useState({});
  const [pinned, setPinned] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headlandsData: HeadlandNavData[] = await getHeadlandsForNav();
        setRoutesData(headlandsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const LiElement = ({
    slug,
    name,
    size = "default",
  }: {
    slug: string;
    name: string;
    size?: "small" | "default";
  }) => {
    const linkPadding = size === "small" ? "py-1 px-2 pl-4" : "p-2 pl-4";
    const textSize = size === "small" ? "text-sm" : "";

    return (
      <li className="group relative">
        <Link
          href={`/sectors/${slug}`}
          onClick={() => setOpen(false)}
          className={cn(
            "block rounded transition-colors",
            linkPadding,
            textSize,
            pathname.includes(slug)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary group-hover:bg-secondary",
          )}
        >
          {name}
        </Link>
        <div className="group absolute right-0 top-1/2 flex h-full -translate-y-1/2 flex-row gap-2 pr-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPinned((prev) => ({
                ...prev,
                [slug]: !prev[slug] ? { slug, name } : false,
              }));
            }}
          >
            <PinIcon className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookmarked((prev) => ({
                ...prev,
                [slug]: !prev[slug],
              }));
            }}
          >
            {bookmarked[slug] ? (
              <BookmarkIcon className="h-4 w-4 fill-current text-primary" />
            ) : (
              <BookmarkIcon className="h-4 w-4 fill-background text-muted-foreground" />
            )}
          </button>
        </div>
      </li>
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80svh] p-0">
        <ScrollArea className="h-[80svh] p-6">
          {/* Top Section */}
          <nav className="mb-6">
            <ul className="space-y-2">
              {topLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
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

          {/* Pinned Sectors */}
          {Object.keys(pinned).length > 0 && (
            <div className="mt-auto w-full flex-grow border-t border-border pb-4 pt-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium">Pinned Sectors</h2>
                <button
                  onClick={() => {
                    setPinned({});
                  }}
                  className="text-sm text-muted-foreground"
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-2">
                {Object.entries(pinned)
                  .filter(([_, value]) => value)
                  .map(([slug, data]) => (
                    <LiElement
                      key={slug}
                      slug={slug}
                      name={data.name}
                      size="small"
                    />
                  ))}
              </ul>
            </div>
          )}

          {/* Headlands and Sectors Accordion */}
          {!loading && (
            <Accordion type="single" collapsible className="w-full flex-grow">
              {routesData.map((headland) => (
                <AccordionItem
                  value={headland.slug}
                  key={headland.slug}
                  className="border-b-0"
                >
                  <AccordionTrigger className="hover:no-underline">
                    {headland.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-2 space-y-2">
                      {headland.sectors.map((sector) => (
                        <LiElement
                          key={sector.slug}
                          name={sector.name}
                          slug={sector.slug}
                        />
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* User Account Section */}
          <UserAccountButtons />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
