"use server";
import { db } from "../db/index";
import { sectors } from "../db/schema";
export type SectorData = {
  slug: string;
  name: string;
  description: string;
  headlandId: number;
};
export interface SectorMetaData extends SectorData {
  id: number;
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
