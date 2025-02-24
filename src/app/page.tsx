import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchBar from "~/components/searchbar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated vector waves */}
      <div className="absolute inset-0 z-0">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Content */}
      <main className="relative z-10 flex w-full flex-grow flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Morgans Bay Climbing
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Discover the best climbing routes at Morgans Bay
        </p>

        {/* Search Bar */}
        <div className="relative mb-8 w-full max-w-md">
          <SearchBar className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>

        <div className="space-x-4">
          <Button asChild>
            <Link href="/sectors">Find a Climb</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/partners">Find a Partner</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
