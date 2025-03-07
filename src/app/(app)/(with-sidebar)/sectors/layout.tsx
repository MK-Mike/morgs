import type React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 w-full flex-col overflow-y-auto">
      <ScrollArea className="flex-1 overflow-auto pb-32">
        <div className="mx-auto max-w-5xl">{children}</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
