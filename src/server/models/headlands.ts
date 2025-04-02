"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index";
import { headlands, sectors } from "../db/schema";
import { revalidatePath } from "next/cache";
import type { SectorNavData } from "./sectors";

export type HeadlandData = {
  slug: string;
  name: string;
  description: string;
};

export type Headland = {
  slug: string;
  name: string;
  description: string;
  id: number;
};
export type HeadlandNavData = {
  id: number;
  slug: string;
  name: string;
  sectors: SectorNavData[];
};
export async function getAllHeadlands() {
  const allHeadlands: Headland[] = await db.select().from(headlands);
  return allHeadlands;
}

export async function createHeadland(headland: HeadlandData) {
  console.log("Server Action: Creating headland", headland); // Good for debugging
  try {
    const result = await db
      .insert(headlands)
      .values({
        name: headland.name,
        slug: headland.slug,
        description: headland.description,
      })
      .returning({ insertedId: headlands.id }); // Example: return the ID

    console.log("Server Action: Inserted ID", result[0]?.insertedId);
    return result; // Or return something more meaningful
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to create headland.");
  }
}
const formSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string(),
});

export async function updateHeadlandAction(formData: {
  name: string;
  slug: string;
  description: string;
  id: number;
}) {
  // Validate data on the server side as well
  const data: z.infer<typeof formSchema> = {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
  };
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    console.error("Server Validation Failed:", validation.error.errors);
    console.log(
      "Data:",
      formData.id,
      formData.slug,
      formData.description,
      formData.name,
    );
    return { error: "Invalid data provided." }; // Return error object
  }

  try {
    if (validation.data.description) {
      await db
        .update(headlands)
        .set({
          name: validation.data.name,
          slug: validation.data.slug,
          description: validation.data.description,
        })
        .where(eq(headlands.id, formData.id));
    }
    if (!validation.data.description) {
      await db
        .update(headlands)
        .set({
          name: validation.data.name,
          slug: validation.data.slug,
        })
        .where(eq(headlands.id, formData.id));
    }

    console.log(`Headland ${formData.id} updated successfully.`);
    // Optionally: Revalidate cache tags if needed
    revalidatePath("/seed/headlands");
    return; // Indicate success (void return)
  } catch (error) {
    console.error("Error updating headland in DB:", error);
    return { error: "Database error: Could not update headland." }; // Return error object
  }
}

export async function getHeadlandsForNav() {
  // Get all headlands with their sectors
  const data = await db
    .select({
      headlandId: headlands.id,
      headlandName: headlands.name,
      headlandSlug: headlands.slug,
      sectorName: sectors.name,
      sectorSlug: sectors.slug,
    })
    .from(headlands)
    .leftJoin(sectors, eq(sectors.headlandId, headlands.id))
    .orderBy(headlands.name, sectors.name);

  // Group by headland
  const headlandMap = new Map<string | number, HeadlandNavData>();

  for (const row of data) {
    if (!headlandMap.has(row.headlandId)) {
      headlandMap.set(row.headlandId, {
        id: row.headlandId,
        name: row.headlandName,
        slug: row.headlandSlug,
        sectors: [],
      });
    }

    // Only add sector if it exists (leftJoin might return nulls)
    if (row.sectorName && row.sectorSlug) {
      headlandMap.get(row.headlandId).sectors.push({
        name: row.sectorName,
        slug: row.sectorSlug,
      });
    }
  }

  return Array.from(headlandMap.values());
}
