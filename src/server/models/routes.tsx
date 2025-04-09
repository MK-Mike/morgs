"use server";
import { z } from "zod";
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

const routeFormSchema = z.object({
  id: z.number(),
  slug: z.string().min(2),
  name: z.string().min(2),
  routeNumber: z.number(),
  grade: z.number(),
  stars: z.number().nullable(),
  firstAscent: z.string(),
  date: z.string() || z.date(),
  info: z.string(),
  routeStyle: z.string(),
  sectorId: z.number(),
  description: z.string(),
});

export async function getAllRoutes() {
  console.log("Server Action: Fetching all routes");
  try {
    const result = await db.select().from(routes);
    // console.log("Server Action: Fetched routes", result);
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
    // console.log("Server Action: Fetched route slugs", result.slice(0, 5));
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
    // console.log("Server Action: Fetched route by slug", result);
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
    // console.log("Server Action: Fetched routes in sector", result);
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch routes in sector.");
  }
}

export async function updateRoute(formData: {
  id: number;
  slug: string;
  name: string;
  routeNumber: number;
  grade: number;
  stars: number | null;
  description: string;
  firstAscent: string;
  date: string;
  info: string;
  routeStyle: string;
  sectorId: number;
}) {
  console.log("Server Action: Updating route", formData);
  const data: z.infer<typeof routeFormSchema> = {
    id: formData.id,
    name: formData.name,
    slug: formData.slug,
    routeNumber: formData.routeNumber,
    grade: formData.grade,
    stars: formData.stars,
    description: formData.description,
    firstAscent: formData.firstAscent,
    date: formData.date,
    info: formData.info,
    routeStyle: formData.routeStyle,
    sectorId: formData.sectorId,
  };
  const validation = routeFormSchema.safeParse(data);
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
    const result = await db
      .update(routes)
      .set({
        sectorId: validation.data.sectorId,
        slug: validation.data.slug,
        name: validation.data.name,
        routeNumber: validation.data.routeNumber,
        grade: validation.data.grade,
        stars: validation.data.stars,
        description: validation.data.description,
        firstAscent: validation.data.firstAscent,
        date: validation.data.date,
        info: validation.data.info,
        routeStyle: validation.data.routeStyle,
      })
      .where(eq(routes.id, validation.data.id));

    console.log("Server Action: Updated route", result);
    return { status: "success", id: validation.data.id }; // Or return something more meaningful
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    return { status: "error", error: "Failed to update route." };
  }
}
