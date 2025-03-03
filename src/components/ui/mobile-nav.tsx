"use client";
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { docsConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useMetaColor } from "@/hooks/use-meta-color";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import routesData from "@/data/routes.json";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { setMetaColor, metaColor } = useMetaColor();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      setMetaColor(open ? "#09090b" : metaColor);
    },
    [setMetaColor, metaColor],
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
      <DrawerContent className="max-h-[60svh] p-0">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            {docsConfig.mainNav?.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </MobileLink>
                ),
            )}
          </div>
          {/* Headlands and Sectors Accordion */}
          <Accordion type="single" collapsible className="w-full">
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
                        <MobileLink
                          href={`/sectors/${sector.slug}`}
                          onOpenChange={setOpen}
                          className={cn(
                            "block rounded p-2 transition-colors",
                            pathname.includes(sector.slug)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary",
                          )}
                        >
                          {sector.name}
                        </MobileLink>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
