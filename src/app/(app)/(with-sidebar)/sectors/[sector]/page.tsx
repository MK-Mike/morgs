"use client";
import type { Headland, Sector, Route, RouteType } from "@/app/types/routes";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import Breadcrumbs from "~/components/Breadcrumbs";
import {
  Star,
  Route as RouteIcon,
  Mountain,
  MapPinCheckIcon,
} from "lucide-react";
import routesData from "~/data/routes.json";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

//mapping for tag colours
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
export default function SectorPage() {
  const { sector } = useParams();

  // Find the sector in the headlands data structure
  const sectorData = routesData.headlands
    .flatMap((headland: Headland) => headland.sectors)
    .find((s: Sector) => s.slug === sector) as Sector | undefined;
  const [minGrade, setMinGrade] = useState("");
  const [maxGrade, setMaxGrade] = useState("");
  const [type, setType] = useState("all");
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!sectorData) {
    return <div>Sector not found</div>;
  }

  const filteredRoutes = sectorData.routes.filter((route: Route) => {
    const gradeFilter =
      (!minGrade || route.grade >= Number(minGrade)) &&
      (!maxGrade || route.grade <= Number(maxGrade));
    const typeFilter =
      type === "all" || sectorData.climbingTypes.includes(type as RouteType);
    return gradeFilter && typeFilter;
  });

  //   r.tags = generateTags();
  // });
  // Mock data for sector information (replace with actual data when available)
  const sectorInfo = {
    access:
      "15-minute walk from the parking area. Follow the marked trail heading east.",
    aspect: "South-facing",
    sun: "Gets sun from mid-morning to late afternoon. Shaded in early morning and evening.",
  };

  const minRouteGrade = Math.min(...sectorData.routes.map((r) => r.grade));
  const maxRouteGrade = Math.max(...sectorData.routes.map((r) => r.grade));

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Breadcrumbs />
      <h1 className="mb-6 text-3xl font-bold">{sectorData.name} Sector</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Description and Access Card */}
        <Card className="flex flex-col items-center md:col-span-2 md:row-span-2">
          <CardHeader>
            <CardTitle>Description & Access</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2">
              <div>
                <dt className="font-semibold">Description:</dt>
                <dd>{sectorData.description}</dd>
              </div>
              <div>
                <dt className="font-semibold">Access:</dt>
                <dd>{sectorInfo.access}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="w-full flex-1">
            <Button className="w-full" asChild>
              <Link
                href={`https://www.google.com/maps/place/32%C2%B042'55.8%22S+28%C2%B019'55.0%22E/@-32.715512,28.331947,1011`}
                target="_blank"
              >
                <MapPinCheckIcon /> Take me there
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Total Routes Card */}
        <Card className="flex flex-col items-center justify-center p-4 text-center">
          <RouteIcon className="mb-2 h-8 w-8 text-primary" />
          <CardTitle className="text-4xl font-bold">
            {sectorData.routes.length}
          </CardTitle>
          <CardDescription>Total Routes</CardDescription>
        </Card>

        {/* Grade Range Card */}
        <Card className="flex flex-col items-center justify-center p-4 text-center">
          <Mountain className="mb-2 h-8 w-8 text-primary" />
          <CardTitle className="text-4xl font-bold">
            {minRouteGrade} - {maxRouteGrade}
          </CardTitle>
          <CardDescription>Grade Range</CardDescription>
        </Card>

        {/* Aspect and Sun Card */}
        <Card className="md:col-span-2 md:col-start-3">
          <CardHeader>
            <CardTitle>Climbing Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2">
              <div>
                <dt className="font-semibold">Aspect:</dt>
                <dd>{sectorInfo.aspect}</dd>
              </div>
              <div>
                <dt className="font-semibold">Sun Exposure:</dt>
                <dd>{sectorInfo.sun}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Image moved below all cards */}
      <div className="mb-8 w-full">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src="/images/mockRoutes.jpg"
            alt={`${sectorData.name} sector`}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-[80%] w-[90%]" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
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
              placeholder={minRouteGrade}
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
              placeholder={maxRouteGrade}
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
            <Select value={type} onValueChange={setType}>
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

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">#</TableHead>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead className="w-1/6">Grade</TableHead>
                <TableHead className="w-1/6">Stars</TableHead>
                <TableHead className="w-1/4 text-end">Tags</TableHead>
                <TableHead className="hidden w-1/6 sm:table-cell">
                  Info
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.slug}>
                  <TableCell>{route.routeNumber}</TableCell>
                  <TableCell>
                    <Link
                      href={`/sectors/${sector}/${route.slug}`}
                      className="text-primary hover:underline"
                    >
                      {route.name}
                    </Link>
                  </TableCell>
                  <TableCell>{route.grade}</TableCell>
                  <TableCell>
                    {route.stars ? (
                      <div className="flex">
                        {[...Array(route.stars)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <div className="flex flex-wrap justify-end gap-1">
                      {route.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant={tagColours.get(tag)}
                          className="mb-1 whitespace-nowrap text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {route.info}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
