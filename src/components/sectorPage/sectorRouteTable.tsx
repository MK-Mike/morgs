import { useState } from "react";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Star } from "lucide-react";
import { FiltersSkeleton, RoutesTableSkeleton } from "./sector-page-skeletons";
import type { Route } from "~/server/models/routes";

// Mapping for tag colours
const tagColours = new Map([
  ["pumpy", "emerald"],
  ["run out", "rose"],
  ["technical", "yellow"],
  ["slabby", "sky"],
  ["juggy", "pink"],
  ["crimpy", "emerald"],
  ["exposed", "rose"],
  ["vertical", "yellow"],
  ["overhang", "sky"],
  ["sustained", "pink"],
]);

interface RoutesTableProps {
  routes: Route[];
  sectorSlug: string;
  isLoading: boolean;
}

export function RoutesTable({
  routes,
  sectorSlug,
  isLoading,
}: RoutesTableProps) {
  const [minGrade, setMinGrade] = useState("");
  const [maxGrade, setMaxGrade] = useState("");
  const [routeStyle, setRouteStyle] = useState("all");

  // Calculate min and max grades from routes
  const minRouteGrade =
    routes.length > 0 ? Math.min(...routes.map((r) => r.grade)) : 0;
  const maxRouteGrade =
    routes.length > 0 ? Math.max(...routes.map((r) => r.grade)) : 0;

  // Filter routes based on user selections
  const filteredRoutes = isLoading
    ? []
    : routes.filter((route: Route) => {
        const gradeFilter =
          (!minGrade || route.grade >= Number(minGrade)) &&
          (!maxGrade || route.grade <= Number(maxGrade));
        const typeFilter =
          routeStyle === "all" || route.routeStyle === routeStyle;
        return gradeFilter && typeFilter;
      });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <FiltersSkeleton />
      ) : (
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="minGrade"
              className="block text-sm font-medium text-gray-700"
            >
              Min Grade
            </label>
            <Input
              id="minGrade"
              type="number"
              placeholder={String(minRouteGrade)}
              value={minGrade}
              onChange={(e) => setMinGrade(e.target.value)}
              className="w-20 sm:w-32"
            />
          </div>
          <div>
            <label
              htmlFor="maxGrade"
              className="block text-sm font-medium text-gray-700"
            >
              Max Grade
            </label>
            <Input
              id="maxGrade"
              type="number"
              placeholder={String(maxRouteGrade)}
              value={maxGrade}
              onChange={(e) => setMaxGrade(e.target.value)}
              className="w-32"
            />
          </div>
          <div>
            <label
              htmlFor="routeType"
              className="block text-sm font-medium text-gray-700"
            >
              Route Style
            </label>
            <Select value={routeStyle} onValueChange={setRouteStyle}>
              <SelectTrigger id="routeType" className="w-[180px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="trad">Trad</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">#</TableHead>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead className="w-1/6">Grade</TableHead>
              <TableHead className="w-1/6">Stars</TableHead>
              <TableHead className="w-1/4 text-end">Tags</TableHead>
              <TableHead className="hidden w-1/6 sm:table-cell">Info</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <RoutesTableSkeleton rows={5} />
          ) : (
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.slug}>
                  <TableCell>{route.routeNumber}</TableCell>
                  <TableCell>
                    <Link
                      href={`/sectors/${sectorSlug}/${route.slug}`}
                      className="text-primary hover:underline"
                    >
                      {route.name}
                    </Link>
                  </TableCell>
                  <TableCell>{route.grade}</TableCell>
                  <TableCell>
                    {route.stars ? (
                      <span className="flex">
                        {Array.from({ length: route.stars }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <span className="flex flex-wrap justify-end gap-1">
                      {route.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant={tagColours.get(tag) ?? "default"}
                          className="mb-1 whitespace-nowrap text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {route.info}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}
