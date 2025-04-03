"use client";
import type { Headland as DataHeadland, Sector } from "@/app/types/routes"; // Renamed to avoid clash
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

import type { Headland as DBHeadland } from "@/server/models/headlands"; // Keep this type
import { getAllHeadlands } from "~/server/models/headlands"; // Import the fetch function
import type { SectorData } from "@/server/models/sectors";
import { createSector } from "@/server/models/sectors";
import { useState, useEffect } from "react"; // Import hooks

export default function SeedSectorPage() {
  const [dbHeadlands, setDbHeadlands] = useState<DBHeadland[]>([]);
  const [allSectors, setAllSectors] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect for fetching headlands
  useEffect(() => {
    const fetchHeadlands = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headlandsData = await getAllHeadlands();
        setDbHeadlands(headlandsData);
      } catch (err) {
        console.error("Failed to fetch headlands:", err);
        setError("Could not load headlands. Bit awkward.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchHeadlands();
  }, []); // Empty dependency array means run once on mount

  // Effect for processing sectors once headlands are fetched
  useEffect(() => {
    if (dbHeadlands.length === 0) {
      // Don't process if headlands aren't loaded yet
      setAllSectors([]); // Ensure sectors are cleared if headlands change/reload
      return;
    }

    const headlandIdMap = new Map<string, number>();
    dbHeadlands.forEach((headland) => {
      headlandIdMap.set(headland.slug, headland.id);
    });

    const processedSectors: SectorData[] = [];
    routesData.headlands.forEach((headland: DataHeadland) => {
      headland.sectors.forEach((sector: Sector) => {
        const headlandId = headlandIdMap.get(headland.slug);
        if (headlandId === undefined) {
          console.warn(
            `Headland slug "${headland.slug}" not found in DB headlands for sector "${sector.name}". Skipping.`,
          );
          return; // Skip if no matching headland ID found
        }
        const sectorData: SectorData = {
          name: sector.name,
          slug: sector.slug,
          description: sector.description,
          headlandId: headlandId,
          // headlandSlug: headland.slug, // Add if needed in SectorData type
        };
        processedSectors.push(sectorData);
      });
    });

    setAllSectors(processedSectors);
  }, [dbHeadlands]); // Re-run this effect if dbHeadlands changes

  const handleAddAllClick = async () => {
    if (allSectors.length === 0) {
      console.log("No sectors to add.");
      return;
    }
    console.log(`Adding ${allSectors.length} sectors...`);
    // Consider adding some feedback for success/failure here
    try {
      // Using Promise.all for potentially better performance if createSector is truly async
      await Promise.all(
        allSectors.map((sector) => {
          console.log("Adding sector", sector.name);
          return createSector(sector); // Assuming createSector returns a Promise
        }),
      );
      console.log("All sectors added (hopefully).");
      // Maybe add a success message to the user
    } catch (err) {
      console.error("Failed to add one or more sectors:", err);
      // Maybe add an error message to the user
    }
  };

  // Display loading or error states
  if (isLoading) {
    return <div>Loading headlands... Stand by.</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // --- Inline Table Components ---
  // Simpler to define them here now they rely on state

  const HeadlandsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>id</TableHead>
          <TableHead>name</TableHead>
          <TableHead>slug</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dbHeadlands.map((headland) => (
          <TableRow key={headland.slug}>
            <TableCell>{headland.id}</TableCell>
            <TableCell>{headland.name}</TableCell>
            <TableCell>{headland.slug}</TableCell>
            <TableCell>{headland.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const SectorsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>name</TableHead>
          <TableHead>slug</TableHead>
          {/* <TableHead>headland slug</TableHead> */}
          {/* Removed headland slug unless you add it back to SectorData */}
          <TableHead>headland id</TableHead>
          <TableHead>description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allSectors.map((sector) => (
          <TableRow key={sector.slug}>
            <TableCell>{sector.name}</TableCell>
            <TableCell>{sector.slug}</TableCell>
            {/* <TableCell>{sector.headlandSlug}</TableCell> */}
            <TableCell>{sector.headlandId}</TableCell>
            <TableCell>{sector.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // --- Render ---
  return (
    <div>
      <h1 className="text-5xl font-bold">Seed Sectors</h1>
      <div className="mb-4 text-2xl">
        <h2 className="mt-4">Headlands From DB</h2>
        <HeadlandsTable />
      </div>
      <div>
        <div className="justify-bewteen flex w-full flex-row items-center">
          {" "}
          {/* Added items-center */}
          <h2 className="mt-4 text-2xl">Sectors from Data</h2>
          <Button onClick={handleAddAllClick} className="ml-4">
            {" "}
            {/* Added margin */}
            Add All ({allSectors.length})
          </Button>
        </div>
        <SectorsTable />
      </div>
    </div>
  );
}
