"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import routesData from "@/data/routes.json"; // Import your data file

interface Route {
  slug: string;
  name: string;
  grade: number;
  length?: number;
  description: string;
  sector: string;
  sectorSlug: string;
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

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResults>({
    matchedRoutes: [],
    matchedSectors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryTerm = searchParams.get("q") || "";

  // Inside your component:
  useEffect(() => {
    const searchLocalData = () => {
      try {
        setIsLoading(true);

        // If no query term, return empty results
        if (!queryTerm) {
          setResults({ matchedRoutes: [], matchedSectors: [] });
          return;
        }

        const lowerCaseTerm = queryTerm.toLowerCase();
        const searchResults: SearchResults = {
          matchedRoutes: [],
          matchedSectors: [],
        };

        // Search through headlands, sectors, and routes
        routesData.headlands.forEach((headland) => {
          headland.sectors.forEach((sector) => {
            // Check if sector matches
            if (sector.name.toLowerCase().includes(lowerCaseTerm)) {
              searchResults.matchedSectors.push({
                name: sector.name,
                description: sector.description,
                headland: headland.name,
                slug: sector.slug,
              });
            }

            // Search through routes in the sector
            sector.routes.forEach((route) => {
              if (route.name.toLowerCase().includes(lowerCaseTerm)) {
                searchResults.matchedRoutes.push({
                  name: route.name,
                  grade: route.grade,
                  length: route.length, // Assuming length is part of the route data
                  description: route.description,
                  sector: sector.name,
                  sectorSlug: sector.slug,
                  headland: headland.name,
                  slug: route.slug,
                });
              }
            });
          });
        });

        setResults(searchResults);
        console.log(searchResults);
      } catch (err) {
        console.error("Error searching data:", err);
        setError("Failed to search routes data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    searchLocalData();
  }, [queryTerm]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[200px] items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalResults =
    results.matchedRoutes.length + results.matchedSectors.length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Search Results {queryTerm && <span>for "{queryTerm}"</span>}
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        {totalResults === 0 && !isLoading ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center">
            <h2 className="mb-2 text-xl">No results found</h2>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <>
            {results.matchedRoutes.length > 0 && (
              <section aria-labelledby="routes-heading">
                <h2
                  id="routes-heading"
                  className="mb-2 border-b pb-2 text-xl font-semibold"
                >
                  Routes ({results.matchedRoutes.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.matchedRoutes.map((route) => (
                    <div
                      key={route.slug}
                      className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <h3 className="text-lg font-bold">{route.name}</h3>
                      <dl className="mt-2 grid grid-cols-2 gap-x-2">
                        <dt className="text-gray-600">Grade:</dt>
                        <dd>{route.grade}</dd>

                        {route.length && (
                          <>
                            <dt className="text-gray-600">Length:</dt>
                            <dd>{route.length} m</dd>
                          </>
                        )}

                        <dt className="text-gray-600">Sector:</dt>
                        <dd>{route.sector}</dd>

                        <dt className="text-gray-600">Headland:</dt>
                        <dd>{route.headland}</dd>
                      </dl>

                      {route.description && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {route.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        <Link
                          href={`/sectors/${route.sectorSlug}/${route.slug}`}
                          className="font-medium text-cyan-800 hover:underline"
                        >
                          View Route Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {results.matchedSectors.length > 0 && (
              <section aria-labelledby="sectors-heading" className="mt-8">
                <h2
                  id="sectors-heading"
                  className="mb-2 border-b pb-2 text-xl font-semibold"
                >
                  Sectors ({results.matchedSectors.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.matchedSectors.map((sector) => (
                    <div
                      key={sector.slug}
                      className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <h3 className="text-lg font-bold">{sector.name}</h3>
                      <p className="mb-2 text-gray-600">
                        <strong>Headland:</strong> {sector.headland}
                      </p>

                      {sector.description && (
                        <div className="mb-4 mt-2">
                          <p className="text-sm text-gray-600">
                            {sector.description}
                          </p>
                        </div>
                      )}

                      <Link
                        href={`/sectors/${sector.slug}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View All Routes in This Sector
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}
