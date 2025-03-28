import { console } from "node:inspector";
import { db } from "../db/index";
import { headlands } from "../db/schema";

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

export const getAllHeadlands = async () => {
  const allHeadlands: Headland[] = await db.select().from(headlands);
  return allHeadlands;
};

//insert new headland
export async function insertHeadland(headlandData: HeadlandData) {
  const newHeadland: typeof headlands.$inferInsert = {
    slug: headlandData.slug,
    name: headlandData.name,
    description: headlandData.description,
  };

  await db.insert(headlands).values(newHeadland);
  console.log(`New Headland Created ${headlandData.name}`);

  const allHeadlands: Headland[] = await getAllHeadlands();
  return allHeadlands;
}
