"use server";
import { db } from "../db/index";
import { routes } from "../db/schema";
import { eq } from "drizzle-orm";
export interface DBRouteData {
  slug: string;
  name: string;
  routeNumber: number;
  grade: number;
  stars: number | null;
  description: string;
  firstAscent: string;
  date: Date | string;
  info: string;
  routeStyle: string;
  sectorId: number;
}
export interface Route {
  id: number;
  slug: string;
  name: string;
  routeNumber: number;
  grade: number;
  stars: number | null;
  description: string;
  firstAscent: string;
  date: Date | string;
  info: string;
  routeStyle: string;
  sectorId: number;
}

export async function getAllRoutes() {
  console.log("Server Action: Fetching all routes");
  try {
    const result = await db.select().from(routes);
    console.log("Server Action: Fetched routes", result);
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch routes.");
  }
}

export async function createRoute(route: DBRouteData) {
  console.log("Server Action: Creating route", route);
  try {
    const result = await db
      .insert(routes)
      .values({
        sectorId: route.sectorId,
        slug: route.slug,
        name: route.name,
        routeNumber: route.routeNumber,
        grade: route.grade,
        stars: route.stars,
        description: route.description,
        firstAscent: route.firstAscent,
        date: route.date,
        info: route.info,
        routeStyle: route.routeStyle,
      })
      .returning({ insertedId: routes.id, insertedName: routes.name });

    console.log("Server Action: Inserted ID", result[0]?.insertedId);
    return result; // Or return something more meaningful
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to create route.");
  }
}

//get an array of route slugs from the database
export async function getRouteSlugs() {
  console.log("Server Action: Fetching route slugs");
  try {
    const result = await db.select({ slug: routes.slug }).from(routes);
    console.log("Server Action: Fetched route slugs", result.slice(0, 5));
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch route slugs.");
  }
}

export async function getRouteBySlug(slug: string) {
  console.log("Server Action: Fetching route by slug", slug);
  try {
    const result: Route[] = await db
      .select()
      .from(routes)
      .where(eq(routes.slug, slug));
    console.log("Server Action: Fetched route by slug", result);
    const route: Route = result[0];
    return route;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch route by slug.");
  }
}

export async function getRoutesInSector(id: number) {
  console.log("Server Action: Fetching routes in sector", id);
  try {
    const result = await db
      .select()
      .from(routes)
      .where(eq(routes.sectorId, id))
      .orderBy(routes.routeNumber);
    console.log("Server Action: Fetched routes in sector", result);
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch routes in sector.");
  }
}
