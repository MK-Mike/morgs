"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import routesData from "@/data/routes.json";
import { Route, Search } from "lucide-react";

interface Route {
  slug: string;
  name: string;
  grade: number;
  length?: number;
  description: string;
  sector: string;
  headland: string;
}

interface Sector {
  slug: string;
  name: string;
  description: string;
  headland: string;
}

interface SearchResults {
  matchedRoutes: Route[];
  matchedSectors: Sector[];
}

interface RoutesData {
  headlands: {
    name: string;
    sectors: {
      name: string;
      description: string;
      slug: string;
      routes: Route[];
    }[];
  }[];
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResults>({
    matchedRoutes: [],
    matchedSectors: [],
  });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocussed, setIsFocussed] = useState(false);

  const router = useRouter();

  const searchRoutes = useCallback((searchTerm: string): SearchResults => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const results: SearchResults = {
      matchedRoutes: [],
      matchedSectors: [],
    };

    try {
      // Assuming routesData is imported properly
      (routesData as RoutesData).headlands.forEach((headland) => {
        headland.sectors.forEach((sector) => {
          if (sector.name.toLowerCase().includes(lowerCaseTerm)) {
            results.matchedSectors.push({
              name: sector.name,
              description: sector.description,
              headland: headland.name,
              slug: sector.slug,
            });
          }

          sector.routes.forEach((route) => {
            if (route.name.toLowerCase().includes(lowerCaseTerm)) {
              results.matchedRoutes.push({
                name: route.name,
                grade: route.grade,
                length: route.length,
                description: route.description,
                sector: sector.slug,
                headland: headland.name,
                slug: route.slug,
              });
            }
          });
        });
      });
    } catch (err) {
      setError("Error searching routes");
      console.error("Search error:", err);
    }

    return results;
  }, []);

  const debouncedSearch = debounce((value: string) => {
    setIsLoading(true);
    const results = searchRoutes(value);
    setFilteredResults(results);
    setIsLoading(false);
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setError(null);

    if (value) {
      debouncedSearch(value);
      setIsDropdownVisible(true);
    } else {
      setFilteredResults({ matchedRoutes: [], matchedSectors: [] });
      setIsDropdownVisible(false);
    }
  };

  const handleSearch = () => {
    try {
      router.push(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    } catch (err) {
      setError("Error performing search");
      console.error("Navigation error:", err);
    }
  };

  const handleResultClick = (result: Route | Sector, isRoute: boolean) => {
    setSearchTerm(result.name);
    setIsDropdownVisible(false);
    // handleSearch();
    if (!isRoute) {
      router.push(`/sectors/${result.slug}`);
      setSearchTerm("");
    } else if (isRoute) {
      router.push(`/sectors/${result.sector}/${result.slug}`);
      setSearchTerm("");
    }
  };

  return (
    <div className="relative my-2">
      <div className="flex items-center">
        {!isFocussed && (
          <Search className="absolute left-3 h-4 w-4 text-gray-500" />
        )}
        <input
          type="search"
          placeholder={!isFocussed ? "Search routes..." : ""}
          className={`w-full rounded-md bg-secondary py-2 ${isFocussed ? "pl-2" : "pl-10"} ${error ? "border-red-500" : "border-gray-300"}`}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocussed(true)}
          onBlur={() => setIsFocussed(false)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}

      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary" />
        </div>
      )}

      {isDropdownVisible && (
        <div className="absolute z-10 mt-1 max-h-96 w-full overflow-y-auto rounded-md border border-gray-300 bg-secondary shadow-lg">
          {filteredResults.matchedRoutes.length === 0 &&
          filteredResults.matchedSectors.length === 0 ? (
            <div className="p-2 text-gray-500">No results found</div>
          ) : (
            <>
              {filteredResults.matchedRoutes.map((route) => (
                <div
                  key={route.slug}
                  className="cursor-pointer p-2 text-accent-foreground hover:bg-cyan-800"
                  onClick={() => handleResultClick(route, true)}
                >
                  <div className="font-medium">{route.name}</div>
                  <div className="text-sm text-secondary-foreground">
                    Grade: {route.grade} | {route.sector}, {route.headland}
                  </div>
                </div>
              ))}
              {filteredResults.matchedSectors.map((sector) => (
                <div
                  key={sector.slug}
                  className="cursor-pointer p-2 hover:bg-cyan-800"
                  onClick={() => handleResultClick(sector, false)}
                >
                  <div className="font-medium">{sector.name}</div>
                  <div className="text-sm text-gray-600">
                    Sector in {sector.headland}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
