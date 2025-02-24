import type React from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import SearchBar from "~/components/searchbar";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-auto p-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative mb-6">
          <SearchBar className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>
        {children}
      </div>
    </div>
  );
}
