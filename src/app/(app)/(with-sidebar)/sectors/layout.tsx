import type React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 w-full flex-col">
      <ScrollArea className="flex-1 pb-32">{children}</ScrollArea>
    </div>
  );
}
