"use client";
import Link from "next/link";

import { siteConfig } from "@/config/site";
// import { CommandMenu } from "@/components/command-menu";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import SearchBar from "./searchbar";

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 pl-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <MainNav />
          <MobileNavDrawer />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <div className="flex-1 md:w-auto md:flex-none">
              <SearchBar />
            </div>
            <nav className="flex items-center gap-0.5">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0"
              >
                <Link
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.whatsApp className="h-4 w-4" />
                  <span className="sr-only">whatsApp</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0"
              >
                <Link
                  href={siteConfig.links.pdfGuide}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.PDF className="h-4 w-4" />
                  <span className="sr-only">PDF Guide</span>
                </Link>
              </Button>
              {/* <ModeSwitcher /> */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
