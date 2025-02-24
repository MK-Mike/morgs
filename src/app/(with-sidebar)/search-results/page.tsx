"use client";
import { useRouter } from "next/router";
import Link from "next/link";

const SearchResults = () => {
  const router = useRouter();
  const { results } = router.query;

  // Parse the results from the query string
  const parsedResults = results
    ? JSON.parse(results)
    : { matchedRoutes: [], matchedSectors: [] };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Search Results</h1>

      <h2 className="mb-2 text-xl font-semibold">Matched Routes</h2>
      {parsedResults.matchedRoutes.length > 0 ? (
        parsedResults.matchedRoutes.map((route) => (
          <div key={route.slug} className="mb-2 rounded border p-4">
            <h3 className="text-lg font-bold">{route.name}</h3>
            <p>
              <strong>Grade:</strong> {route.grade}
            </p>
            <p>
              <strong>Length:</strong> {route.length} m
            </p>
            <p>
              <strong>Description:</strong> {route.description}
            </p>
            <Link href={`/routes/${route.slug}`}>
              <a className="text-blue-500 hover:underline">View Route</a>
            </Link>
          </div>
        ))
      ) : (
        <p>No matching routes found.</p>
      )}

      <h2 className="mb-2 text-xl font-semibold">Matched Sectors</h2>
      {parsedResults.matchedSectors.length > 0 ? (
        parsedResults.matchedSectors.map((sector) => (
          <div key={sector.slug} className="mb-2 rounded border p-4">
            <h3 className="text-lg font-bold">{sector.name}</h3>
            <p>
              <strong>Headland:</strong> {sector.headland}
            </p>
            <p>
              <strong>Description:</strong> {sector.description}
            </p>
            <Link href={`/sectors/${sector.slug}`}>
              <a className="text-blue-500 hover:underline">View Sector</a>
            </Link>
          </div>
        ))
      ) : (
        <p>No matching sectors found.</p>
      )}
    </div>
  );
};

export default SearchResults;
