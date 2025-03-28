import routesJSON from "../../data/routes.json";
import { insertHeadland } from "../models/headlands";
import type { Headland, RoutesData } from "~/app/types/routes";
import type { HeadlandData } from "../models/headlands";

const routes: RoutesData = routesJSON as RoutesData;

export default function main(data: RoutesData): void {
  const headlands: HeadlandData[] = [];
  data.headlands.forEach((entry: Headland) => {
    headlands.push({
      slug: entry.slug,
      name: entry.name,
      description: entry.description,
    });
  });

  for (const headland of headlands) {
    const allHeadlands = insertHeadland(headland);
    console.log(allHeadlands);
  }
}
main(routes);
