"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  BookmarkIcon,
  Info,
  MapPin,
  PinIcon,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { HeadlandNavData } from "~/server/models/headlands";
import { getHeadlandsForNav } from "~/server/models/headlands";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import UserAccountButtons from "./UserAccountButtons";
import { useAuth, useUser } from "@clerk/nextjs";
import { getUserRole } from "@/server/models/users";

const topLinks = [
  { name: "About", href: "/about", icon: Info, admin: false },
  // { name: "Environment & Ethics", href: "/environment-ethics", icon: Leaf },
  // { name: "Accommodation", href: "/accommodation", icon: Home },
  // { name: "Activities", href: "/activities", icon: Compass },
  { name: "Users", href: "/users", icon: UserIcon, admin: true },
  { name: "Routes", href: "/sectors", icon: MapPin, admin: false },
];

export default function Sidebar() {
  const [loading, setLoading] = useState(true);
  const [routesData, setRoutesData] = useState<HeadlandNavData[]>();
  const [bookmarked, setBookmarked] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinned, setPinned] = useState({});
  const [filteredTopLink, setFilteredTopLinks] = useState(topLinks);
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

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        // Admins see all links
        setFilteredTopLinks(topLinks);
      } else {
        // Non-admins see only non-admin links
        const filtered = topLinks.filter((link) => !link.admin);
        setFilteredTopLinks(filtered);
      }
    } else {
      // Handle the case where there's no user
      const filtered = topLinks.filter((link) => !link.admin);
      setFilteredTopLinks(filtered);
    }
  }, [isAdmin, user]);

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
  const pathname = usePathname();

  const LiElement = ({
    slug,
    name,
    size = "default", // Default size
  }: {
    slug: string;
    name: string;
    size?: "small" | "default"; // Define possible sizes
  }) => {
    // Determine classes based on size
    const linkPadding = size === "small" ? "py-1 px-2 pl-4" : "p-2 pl-4"; // Adjust padding
    const textSize = size === "small" ? "text-sm" : ""; // Adjust text size if needed

    return (
      <li className="group relative">
        <Link
          href={`/sectors/${slug}`}
          className={cn(
            "block rounded transition-colors",
            linkPadding, // Apply dynamic padding
            textSize, // Apply dynamic text size
            pathname.includes(slug)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary group-hover:bg-secondary",
          )}
        >
          {name}
        </Link>
        <div className="group absolute right-0 top-1/2 flex h-full -translate-y-1/2 flex-row gap-2 pr-2 transition-opacity">
          <div
            className={cn(
              "transition-all duration-300",
              pathname.includes(slug)
                ? "pointer-events-none absolute inset-0 -left-8 bg-gradient-to-l from-white to-transparent opacity-0 group-hover:opacity-100"
                : "pointer-events-none absolute inset-0 -left-8 bg-gradient-to-l from-secondary to-transparent opacity-0 group-hover:opacity-100",
            )}
          ></div>
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
            <PinIcon className="h-4 w-4 translate-x-8 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </button>
          <button
            className={cn(
              "transition-all duration-300",
              bookmarked[slug]
                ? "opacity-100"
                : "translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
            )}
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
    <div className="bg-surface flex h-[calc(100vh-28px)] w-64 flex-col justify-between border-r border-secondary p-4">
      <ScrollArea className="flex-1 overflow-auto">
        {/* Top Section */}
        <nav className="mb-6">
          <ul className="space-y-2">
            {filteredTopLink.map((link) => (
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
                .filter(([_, value]) => value) // Filter out any false values
                .map(([slug, data]) => (
                  <LiElement
                    key={slug}
                    slug={slug}
                    name={data.name}
                    size="small" // Access the name from the stored object
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {/* User Account Section */}
      <UserAccountButtons />
    </div>
  );
}
