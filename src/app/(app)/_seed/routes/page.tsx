"use client";
import type {
  Headland as DataHeadland,
  Route,
  Sector,
} from "@/app/types/routes"; // Renamed to avoid clash
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import routesData from "~/data/routes.json";
import { Button } from "~/components/ui/button";

import { getAllSectors } from "~/server/models/sectors";
import type { SectorMetaData } from "@/server/models/sectors";
import { createRoute, getRouteSlugs } from "@/server/models/routes";
import type { DBRouteData } from "@/server/models/routes";
import { useState, useEffect } from "react";

const infoMap = new Map<string, string>();
infoMap.set(null, "-");
infoMap.set("T, A0", "trad");
infoMap.set("T&1RB", "trad");
infoMap.set("T&2RB", "trad");
infoMap.set("1RB&T", "trad");
infoMap.set("4RB&T, A0", "trad");
infoMap.set("T & 5RB", "trad");
infoMap.set("A0 T", "trad");
infoMap.set("(T)", "trad");
infoMap.set("(S)", "solo");
infoMap.set("(Solo)", "solo");
infoMap.set("(5B&C)", "sport");
infoMap.set("(4RB&T)", "trad");
infoMap.set("(8B&C)", "sport");
infoMap.set("(C only)", "trad");
infoMap.set("T", "trad");
infoMap.set("S", "sport");
infoMap.set("solo", "solo");

export default function SeedSectorPage() {
  const [allSectors, setAllSectors] = useState<SectorMetaData[]>([]);
  const [allRoutes, setAllRoutes] = useState<DBRouteData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [numRoutesAdded, setNumRoutesAdded] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [routeSlugs, setRouteSlugs] = useState<string[]>([]);

  // Effect for fetching sectors
  useEffect(() => {
    const fetchSectors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sectorsData = await getAllSectors();
        setAllSectors(sectorsData);
      } catch (err) {
        console.error("Failed to fetch sectors:", err);
        setError("Could not load sectors. Bit awkward.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSectors();
  }, []);

  // Effect for fetching route slugs
  useEffect(() => {
    const fetchRouteSlugs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dbRouteSlugs = await getRouteSlugs();
        const slugArray: string[] = dbRouteSlugs.flatMap(
          (result) => result.slug,
        );
        console.log("Slugs:", slugArray);
        setRouteSlugs(slugArray);
      } catch (err) {
        console.error("Failed to fetch route slugs:", err);
        setError("Could not load route slugs. Bit awkward.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRouteSlugs();
  }, [allSectors]);

  // Effect for processing routes once sectors are fetched
  useEffect(() => {
    if (allSectors.length === 0) {
      return;
    }

    const sectorsIDMap = new Map<string, number>();
    allSectors.forEach((sector) => {
      sectorsIDMap.set(sector.slug, sector.id);
    });

    const processedRoutes: DBRouteData[] = [];
    routesData.headlands.forEach((headland: DataHeadland) => {
      headland.sectors.forEach((sector: Sector) => {
        const sectorId = sectorsIDMap.get(sector.slug);
        sector.routes.forEach((route: Route) => {
          if (routeSlugs.includes(route.slug)) {
            console.log("Skipping route", route.slug);
            return;
          }
          processedRoutes.push({
            slug: route.slug,
            name: route.name,
            routeNumber: route.routeNumber,
            grade: route.grade,
            stars: route.stars,
            description: route.description,
            firstAscent: route.first_ascent,
            date: route.date === "n/a" ? "" : route.date,
            info: route.info,
            routeStyle: infoMap.get(route.info) ?? "-",
            sectorId: sectorId,
          } satisfies DBRouteData);
        });
      });
    });
    const infoArray = new Set<string>(
      processedRoutes.map((route) => route.info),
    );
    console.log("Info Array:", infoArray);

    setAllRoutes(processedRoutes);
  }, [allSectors, routeSlugs]);

  const handleAddAllClick = async () => {
    setIsCreating(true);
    // Reset count if needed, or rely on parent component state logic
    // setNumRoutesAdded(0); // Optional: Reset count at the start of a batch

    if (allRoutes.length === 0) {
      console.log("No routes to add.");
      setIsCreating(false);
      return;
    }

    console.log(`Starting to add ${allRoutes.length} routes...`);

    // Create an array to track completion of each operation
    const promises = allRoutes.map((route) => {
      // Prepare data for this specific route
      const preparedRoute = {
        ...route,
        description: route.description ?? " ",
        date: new Date(route.date),
        routeStyle:
          route.routeStyle === "-" ? infoMap.get(route.info) : route.routeStyle,
      };

      // Return the promise chain for this single route
      return createRoute(preparedRoute)
        .then(() => {
          // Success for *this* route
          console.log(`Successfully added route: ${preparedRoute.name}`);
          // Update state immediately using functional update
          setNumRoutesAdded((prevCount) => prevCount + 1);
        })
        .catch((err) => {
          // Failure for *this* route
          console.error(
            `Failed to add route: ${preparedRoute.name}. Reason:`,
            err,
          );
          // Optionally: update a separate error count state?
          // setErrorCount(prev => prev + 1);

          // Important: Catch the error here so Promise.allSettled below
          // doesn't see it as an unhandled rejection for *this specific operation*.
          // We've handled it by logging.
        });
    });

    // Use Promise.allSettled just to know when everything is done
    try {
      await Promise.allSettled(promises);
      console.log("Finished processing all route requests.");
      // Add final user feedback if desired (e.g., based on final count vs total)
    } catch (err) {
      // Should be unlikely to hit this specific catch block now,
      // as individual errors are caught above.
      console.error("An unexpected error occurred while waiting:", err);
    } finally {
      // Ensure loading state is turned off once all promises have settled
      setIsCreating(false);
    }
  };
  // Display loading or error states
  if (isLoading) {
    return <div>Loading sectors... Stand by.</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // --- Inline Table Components ---
  // Simpler to define them here now they rely on state

  const RoutesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Route No.</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Stars</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>First Ascent</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Info</TableHead>
          <TableHead>Style</TableHead>
          <TableHead>Sector ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allRoutes.map((route: DBRouteData) => (
          <TableRow key={`${route.slug}-${route.routeNumber}`}>
            <TableCell>{route.name}</TableCell>
            <TableCell>{route.slug}</TableCell>
            <TableCell>{route.routeNumber}</TableCell>
            <TableCell>{route.grade}</TableCell>
            <TableCell>{route.stars ?? "N/A"}</TableCell>{" "}
            {/* Handle null stars */}
            <TableCell>{route.description}</TableCell>
            <TableCell>{route.firstAscent}</TableCell>
            <TableCell>{`${route.date}`}</TableCell> {/* Format date */}
            <TableCell>{route.info}</TableCell>
            <TableCell>{route.routeStyle}</TableCell>
            <TableCell>{route.sectorId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // --- Render ---
  return (
    <div>
      <h1 className="text-5xl font-bold">Seed Sectors</h1>
      <div>
        <div className="justify-bewteen flex w-full flex-row items-center">
          <h2 className="mt-4 text-2xl">Routes from Data</h2>
          <Button onClick={handleAddAllClick} className="ml-4">
            {isCreating
              ? `Working...(${numRoutesAdded}/${allRoutes.length})`
              : `Add All (${allRoutes.length})`}
          </Button>
        </div>
        <RoutesTable />
      </div>
    </div>
  );
}
