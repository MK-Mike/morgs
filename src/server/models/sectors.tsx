"use server";
import { db } from "../db/index";
import { sectors } from "../db/schema";
import { eq } from "drizzle-orm";
export type SectorData = {
  id: number;
  slug: string;
  name: string;
  description: string;
  headlandId: number;
};
export interface SectorMetaData extends SectorData {
  id: number;
}
export async function getAllSectors() {
  console.log("Server Action: Fetching all sectors");
  try {
    const result = await db.select().from(sectors);
    console.log("Server Action: Fetched sectors. First 5:", result.slice(0, 5));
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sectors.");
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
    console.log("Server Action: Fetched sector by id", result);
    const sector: SectorData = result[0];
    return sector;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch sector by id.");
  }
}
