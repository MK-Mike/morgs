import type React from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-auto p-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search routes..."
            className="bg-secondary pl-10"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
