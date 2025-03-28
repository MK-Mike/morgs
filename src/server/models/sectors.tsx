import { db } from "../db/index";
import { sectors } from "../db/schema";
export type SectorMetaData = {
  id: string;
  slug: string;
  name: string;
  description: string;
};
