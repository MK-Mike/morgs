import type React from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SearchBar from "~/components/searchbar";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="mx-auto w-full max-w-5xl p-2">
        <div className="relative mb-2">
          <SearchBar />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4">{children}</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
