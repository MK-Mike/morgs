"use client";
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
import {
  createHeadland,
  getAllHeadlands,
  updateHeadlandAction,
} from "~/server/models/headlands";

import type { Headland as DBHeadland } from "@/server/models/headlands";
type Headland = {
  name: string;
  slug: string;
  description: string;
};
import { Suspense, useCallback, useEffect, useState } from "react";
import { EditHeadlandDialog } from "~/components/EditHeadlandDialog";

//map over the routes to get an array of headlands
const jsonHeadlands: Headland[] = [];
routesData.headlands.forEach((headland: Headland) =>
  jsonHeadlands.push({
    name: headland.name,
    slug: headland.slug,
    description: headland.description,
  }),
);
//get the headlands from the db
function DBHeadlandsTable() {
  const [dbHeadlands, setHeadlands] = useState<DBHeadland[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Create a callback to update the trigger state
  const handleEditFinished = useCallback(() => {
    console.log("Edit finished, triggering refetch...");
    setRefreshTrigger((count) => count + 1); // Increment to trigger effect
  }, []); // useCallback ensures this function identity is stable]
  //use effect to fetch data from the db
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllHeadlands();
        setHeadlands(data);
      } catch (error) {
        console.error("Error fetching headlands from DB", error);
      }
    }
    void fetchData();
  }, [refreshTrigger]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>id</TableHead>
          <TableHead>name</TableHead>
          <TableHead>slug</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dbHeadlands.map((headland: DBHeadland) => (
          <TableRow key={headland.slug}>
            <TableCell>{headland.id}</TableCell>
            <TableCell>{headland.name}</TableCell>
            <TableCell>{headland.slug}</TableCell>
            <TableCell>{headland.description}</TableCell>
            <TableCell>
              <EditHeadlandDialog
                headland={headland}
                onSaveAction={updateHeadlandAction}
                onFinishedAction={handleEditFinished}
              >
                <Button>Edit</Button>
              </EditHeadlandDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

//return a table of headlands from the db
function HeadlandsTable() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbHeadlands, setHeadlands] = useState<DBHeadland[]>([]);
  //use effect to fetch data from the db
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllHeadlands();
        setHeadlands(data);
      } catch (error) {
        console.error("Error fetching headlands from DB", error);
      }
    }
    void fetchData();
  }, []);

  const handleAddClick = async (headlandData: Headland) => {
    setIsSubmitting(true);
    try {
      await createHeadland(headlandData);
      // Maybe add success feedback, e.g., re-fetch data or show a toast
      console.log("Headland added successfully!");
    } catch (error) {
      console.error("Failed to add headland:", error);
      // Show error feedback to the user
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>name</TableHead>
          <TableHead>slug</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jsonHeadlands.map((headland: DBHeadland) => (
          <TableRow key={headland.slug}>
            <TableCell>{headland.name}</TableCell>
            <TableCell>{headland.slug}</TableCell>
            <TableCell>{headland.description}</TableCell>
            <TableCell>
              {/* Check if the headland exists in the db */}
              {dbHeadlands.find(
                (dbHeadland) => dbHeadland.slug === headland.slug,
              ) ? (
                ""
              ) : (
                <Button
                  onClick={() =>
                    handleAddClick({
                      name: headland.name,
                      slug: headland.slug,
                      description: headland.description,
                    })
                  }
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  type="button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function SeedSectorPage() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Seed Headlands </h1>
      <div className="mb-4 text-2xl">
        <h2 className="mt-4">Headlands From routes.json</h2>
        <HeadlandsTable />
      </div>
      <div className="mb-4 text-2xl">
        <h2 className="mt-4">Edit Headland</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <DBHeadlandsTable />
        </Suspense>
      </div>
    </div>
  );
}
