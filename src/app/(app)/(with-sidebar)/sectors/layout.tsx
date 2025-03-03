import type React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ScrollArea className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4">{children}</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
