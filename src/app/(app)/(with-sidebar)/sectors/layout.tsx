"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SiteFooter } from "~/components/site-footer";
import { LoadingContext } from "~/contexts/sector-loading-context";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [childrenLoaded, setChildrenLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={{ childrenLoaded, setChildrenLoaded }}>
      <div className="flex min-h-0 w-full flex-col">
        <ScrollArea className="flex-1 pb-32">
          {children}
          {childrenLoaded && <SiteFooter />}
        </ScrollArea>
      </div>
    </LoadingContext.Provider>
  );
}
