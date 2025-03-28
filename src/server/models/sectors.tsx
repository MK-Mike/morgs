import { db } from "../db/index";
import { sectors } from "../db/schema";
import type { Sector as SectorData } from "~/app/types/routes";
export interface Sector extends SectorData {
  id: string;
}
