// Types for individual route data
export type RouteType = "Trad" | "Sport" | "Bouldering";
export type GradeRange = "0-10" | "11-15" | "16-20" | "21+";

export interface Route {
  slug: string;
  name: string;
  routeNumber: number;
  grade: number;
  stars: number | null;
  description: string;
  first_ascent: string;
  date: string;
  info: string;
  tags: string[];
  routeStyle: string;
}

// Types for sector data
export interface GradeDistribution {
  [key: string]: number; // e.g. "0-10": 2
}

export interface Sector {
  slug: string;
  name: string;
  description: string;
  climbingTypes: RouteType[];
  gradeDistribution: GradeDistribution;
  routes: Route[];
}

// Types for headland data
export interface Headland {
  slug: string;
  name: string;
  description: string;
  sectors: Sector[];
}

// Type for the complete data structure
export interface RoutesData {
  headlands: Headland[];
}

// Types for the grade buckets used in the UI
export interface GradeBucket {
  label: string;
  color: string;
  count: number;
}

// Types for sector card props
export interface SectorCardProps {
  name: string;
  slug: string;
  description: string;
  gradeBuckets: GradeBucket[];
  routeTypes: string[];
  totalRoutes: number;
}

// Helper type for the processed sector data
export interface ProcessedSector extends SectorCardProps {
  headland: string;
}
