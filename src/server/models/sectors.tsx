"use server";
import { db } from "../db/index";
import { sectors, routes } from "../db/schema";
import { eq, sql } from "drizzle-orm";
export type SectorData = {
  id: number;
  slug: string;
  name: string;
  description: string;
  headlandId: number;
};
export type SectorNavData = {
  slug: string;
  name: string;
};
export type gradeBucket = {
  name: string;
  count: number;
};
export interface SectorMetaData extends SectorData {
  gradeBuckets: gradeBucket[];
  routeTypes: string[];
}
interface SectorMetaResult extends SectorData {
  totalRoutes: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  veryHardCount: number;
  routeTypes: string;
}
export async function getAllSectors() {
  console.log("Server Action: Fetching all sectors");
  try {
    const result = await db.select().from(sectors);
    // console.log("Server Action: Fetched sectors. First 5:", result.slice(0, 5));
    console.log("Server Action: Fetched sectors.");
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sectors.");
  }
}

export async function getAllSectorsWithMetaData() {
  console.log("Server Action: Fetching all sectors with meta data");
  try {
    const result: SectorMetaResult[] = await db
      .select({
        id: sectors.id,
        name: sectors.name,
        slug: sectors.slug,
        description: sectors.description,
        headlandId: sectors.headlandId,
        easyCount:
          sql<number>`sum(case when ${routes.grade} >= 0 and ${routes.grade} <= 16 then 1 else 0 end)`.as(
            "easy_count",
          ),
        mediumCount:
          sql<number>`sum(case when ${routes.grade} >= 17 and ${routes.grade} <= 24 then 1 else 0 end)`.as(
            "medium_count",
          ),
        hardCount:
          sql<number>`sum(case when ${routes.grade} >= 25 and ${routes.grade} <= 32 then 1 else 0 end)`.as(
            "hard_count",
          ),
        veryHardCount:
          sql<number>`sum(case when ${routes.grade} >= 33 then 1 else 0 end)`.as(
            "very_hard_count",
          ),
        routeTypes: sql<string>`array_agg(distinct ${routes.routeStyle})`.as(
          "route_types",
        ),
        totalRoutes: sql<number>`count(${routes.id})`.as("total_routes"),
      })
      .from(sectors)
      .leftJoin(routes, eq(routes.sectorId, sectors.id))
      .groupBy(
        sectors.id,
        sectors.name,
        sectors.slug,
        sectors.description,
        sectors.headlandId,
      )
      .orderBy(sectors.name);
    console.log("Server Action: Fetched sectors with meta data. :");
    const sectorsWithMetaData: SectorMetaData[] = [];

    result.forEach((result) => {
      let routeTypesArray: string[] = [];

      // Handle the PostgreSQL array literal string
      if (result.routeTypes && typeof result.routeTypes === "string") {
        // Remove the curly braces and split by comma
        const cleanString: string = result.routeTypes.replace(/[{}]/g, "");

        if (cleanString) {
          routeTypesArray = cleanString
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "NULL" && item !== "");
        }
      }

      const validTypes = ["trad", "sport", "solo"];
      const filteredRouteTypes = routeTypesArray.filter((type) =>
        validTypes.includes(type),
      );

      const s: SectorMetaData = {
        id: result.id,
        name: result.name,
        slug: result.slug,
        description: result.description,
        headlandId: result.headlandId,
        routeTypes: filteredRouteTypes,
        gradeBuckets: [
          { name: "easy", count: result.easyCount },
          { name: "medium", count: result.mediumCount },
          { name: "hard", count: result.hardCount },
          { name: "veryHard", count: result.veryHardCount },
        ],
      };
      sectorsWithMetaData.push(s);
    });
    console.log("transformed data:", sectorsWithMetaData[0].routeTypes);

    return sectorsWithMetaData;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sectors with meta data.");
  }
}

export async function createSector(sector: SectorData) {
  console.log("Server Action: Creating sector", sector);
  try {
    const result = await db
      .insert(sectors)
      .values({
        name: sector.name,
        slug: sector.slug,
        description: sector.description,
        headlandId: sector.headlandId,
      })
      .returning({ insertedId: sectors.id }); // Example: return the ID

    console.log("Server Action: Inserted ID", result[0]?.insertedId);
    return result; // Or return something more meaningful
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to create sector.");
  }
}

export async function getSectorById(id: number) {
  console.log("Server Action: Fetching sector by id", id);
  try {
    const result: SectorData[] = await db
      .select()
      .from(sectors)
      .where(eq(sectors.id, id));
    // console.log("Server Action: Fetched sector by id", result);
    const sector: SectorData = result[0];
    return sector;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sector by id.");
  }
}

export async function getSectorBySlug(slug: string) {
  console.log("Server Action: Fetching sector by slug", slug);
  try {
    const result: SectorData[] = await db
      .select()
      .from(sectors)
      .where(eq(sectors.slug, slug));
    // console.log("Server Action: Fetched sector by slug", result);
    const sector: SectorData = result[0];
    return sector;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sector by slug.");
  }
}

export async function getSectorsAndIds() {
  console.log("Server Action: Fetching all sectors and ids");
  try {
    const result = await db
      .select({
        id: sectors.id,
        name: sectors.name,
        routeNumbers: sql<number[]>`array_agg(${routes.routeNumber})`.as(
          "route_numbers",
        ),
      })
      .from(sectors)
      .leftJoin(routes, eq(routes.sectorId, sectors.id))
      .groupBy(sectors.id, sectors.name);

    // Clean up the route numbers array (remove nulls, etc.)
    const cleanedResult = result.map((sector) => ({
      id: sector.id,
      name: sector.name,
      routeNumbers: Array.isArray(sector.routeNumbers)
        ? sector.routeNumbers.filter((num) => num !== null)
        : [],
    }));

    console.log("Server Action: Fetched sectors and ids with route numbers.");
    return cleanedResult;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch sectors and ids.");
  }
}
