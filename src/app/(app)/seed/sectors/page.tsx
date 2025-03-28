import type { Headland, Sector, Route, RouteType } from "@/app/types/routes";
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
import { db } from "~/server/db";
import { headlands } from "@/server/db/schema";

import type { Headland as DBHeadland } from "@/server/models/headlands";
import type { SectorMetaData } from "@/server/models/sectors";
import { Suspense } from "react";
interface SectorWithHeadlandSlug extends Sector {
  headlandSlug?: string;
}

//get the sectors from the routes.headlands
const allSectors: SectorWithHeadlandSlug[] = [];

routesData.headlands.forEach((headland: Headland) => {
  headland.sectors.forEach((sector) => {
    const sectorData: SectorWithHeadlandSlug = sector;
    sectorData.headlandSlug = headland.slug;
    allSectors.push(sector);
  });
});

//get the headlands from the db
const dbHeadlands = await db.select().from(headlands);

//map of headland slug to headland id from db data o
const headlandIdMap = new Map();
dbHeadlands.map((headland: DBHeadland) =>
  headlandIdMap.set(headland.slug, headland.id),
);
//return a table of headlands
async function HeadlandsTable() {
  return (
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
        {dbHeadlands.map((headland: DBHeadland) => (
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
}
//return a table of sectors
const SectorsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>name</TableHead>
          <TableHead>slug</TableHead>
          <TableHead>headland slug</TableHead>
          <TableHead>headland id</TableHead>
          <TableHead>description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allSectors.map((sector: SectorWithHeadlandSlug) => (
          <TableRow key={sector.slug}>
            <TableCell>{sector.name}</TableCell>
            <TableCell>{sector.slug}</TableCell>
            <TableCell>{sector.headlandSlug}</TableCell>
            <TableCell>{headlandIdMap.get(sector.headlandSlug)}</TableCell>
            <TableCell>{sector.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

//server action to insert new sector, matching the sectors headlands to the headland id
//

export default function SeedSectorPage() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Seed Sectors </h1>
      <div className="mb-4 text-2xl">
        <h2 className="mt-4">Headlands From DB</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <HeadlandsTable />
        </Suspense>
      </div>
      <h2 className="mt-4 text-2xl">Sectors from Data</h2>
      <SectorsTable />
    </div>
  );
}
