"use client";
import { useEffect, useState, useContext } from "react";
import { notFound, useParams } from "next/navigation";
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
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DescriptionCardSkeleton,
  StatsCardSkeleton,
  ConditionsCardSkeleton,
  FiltersSkeleton,
  RoutesTableSkeleton,
  SectorImageSkeleton,
} from "~/components/sectorPage/sector-page-skeletons";
import { RoutesTable } from "~/components/sectorPage/sectorRouteTable";

import { getSectorBySlug } from "~/server/models/sectors";
import { getRoutesInSector } from "~/server/models/routes";
import type { SectorData as Sector } from "~/server/models/sectors";
import type { Route } from "~/server/models/routes";
import { LoadingContext } from "~/contexts/sector-loading-context";
import { useHeadlandAndSector } from "~/contexts/headland-sector-context";

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
  const { sector: sectorSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sectorData, setSectorData] = useState<Sector | undefined>(undefined);
  const [sectorRoutes, setSectorRoutes] = useState<Route[] | undefined>(
    undefined,
  );
  const { headlands, sectors } = useHeadlandAndSector();

  const [minGrade, setMinGrade] = useState("");
  const [maxGrade, setMaxGrade] = useState("");
  const [routeStyle, setRouteStyle] = useState("all");
  const { setChildrenLoaded } = useContext(LoadingContext);

  const sectorName = sectors.find((s) => s.slug === sectorSlug)?.name;

  useEffect(() => {
    setChildrenLoaded(false);
    const fetchData = async () => {
      if (!sectorSlug) return; // Guard clause

      setIsLoading(true);
      try {
        // Fetch the primary sector data
        const currentSector: Sector = await getSectorBySlug(String(sectorSlug));
        setSectorData(currentSector);

        // Fetch the routes in this sector
        const routes: Route[] = await getRoutesInSector(currentSector.id);
        setSectorRoutes(routes);
        const minRouteGrade = Math.min(...routes.map((r) => r.grade));
        const maxRouteGrade = Math.max(...routes.map((r) => r.grade));
        setMinGrade(String(minRouteGrade));
        setMaxGrade(String(maxRouteGrade));
        setChildrenLoaded(true);
      } catch (e) {
        console.error("Failed to fetch sector data:", e);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [sectorSlug, setChildrenLoaded]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (!isLoading && !sectorData) {
    return <div>Sector not found</div>;
  }

  const tags = [];
  // });
  // Mock data for sector information (replace with actual data when available)
  const sectorInfo = {
    access:
      "15-minute walk from the parking area. Follow the marked trail heading east.",
    aspect: "South-facing",
    sun: "Gets sun from mid-morning to late afternoon. Shaded in early morning and evening.",
  };

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Breadcrumbs />
      <h1 className="mb-6 text-3xl font-bold">{sectorName} Sector</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Description and Access Card */}
        {isLoading ? (
          <DescriptionCardSkeleton />
        ) : (
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
        )}

        {/* Total Routes Card */}
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card className="flex flex-col items-center justify-center p-4 text-center">
            <RouteIcon className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-4xl font-bold">
              {sectorRoutes.length}
            </CardTitle>
            <CardDescription>Total Routes</CardDescription>
          </Card>
        )}

        {/* Grade Range Card */}
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card className="flex flex-col items-center justify-center p-4 text-center">
            <Mountain className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-4xl font-bold">
              {minGrade} - {maxGrade}
            </CardTitle>
            <CardDescription>Grade Range</CardDescription>
          </Card>
        )}

        {/* Aspect and Sun Card */}
        {isLoading ? (
          <ConditionsCardSkeleton />
        ) : (
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
        )}
      </div>

      {/* Image moved below all cards */}
      {isLoading ? (
        <SectorImageSkeleton />
      ) : (
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
      )}

      <div className="space-y-4">
        <RoutesTable
          routes={sectorRoutes || []}
          sectorSlug={String(sectorSlug)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
