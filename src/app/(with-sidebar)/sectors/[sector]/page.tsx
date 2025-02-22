"use client";
import { Headland, Sector, Route } from "@/types/routes";

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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Star } from "lucide-react";
import routesData from "~/data/routes.json";
import type { Sector, Route } from "~/types/routes";

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
    const typeFilter = type === "all" || sectorData.info.includes(type as any);
    return gradeFilter && typeFilter;
  });

  // Mock data for sector information (replace with actual data when available)
  const sectorInfo = {
    access:
      "15-minute walk from the parking area. Follow the marked trail heading east.",
    aspect: "South-facing",
    sun: "Gets sun from mid-morning to late afternoon. Shaded in early morning and evening.",
    rock: "Solid dolerite with excellent friction.",
    season:
      "Climbable year-round, but best conditions are from April to October.",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="mb-6 text-3xl font-bold">{sectorData.name} Sector</h1>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sector Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="font-semibold">Description:</dt>
                <dd>{sectorData.description}</dd>
              </div>
              <div>
                <dt className="font-semibold">Climbing Types:</dt>
                {/* <dd>{sectorData.info.join(", ")}</dd> */}
              </div>
              <div>
                <dt className="font-semibold">Total Routes:</dt>
                <dd>{sectorData.routes.length}</dd>
              </div>
              <div>
                <dt className="font-semibold">Grade Range:</dt>
                <dd>
                  {Math.min(...sectorData.routes.map((r) => r.grade))} -{" "}
                  {Math.max(...sectorData.routes.map((r) => r.grade))}
                </dd>
              </div>
              {/* Additional sector info */}
              {Object.entries(sectorInfo).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-semibold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src="/placeholder.svg?height=360&width=640"
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
              placeholder="Min Grade"
              value={minGrade}
              onChange={(e) => setMinGrade(e.target.value)}
              className="w-32"
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
              placeholder="Max Grade"
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
              Route Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="routeType" className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trad">Trad</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>First Ascent</TableHead>
              <TableHead>Info</TableHead>
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
                <TableCell>{route.first_ascent}</TableCell>
                <TableCell>{route.info}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
