"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Route } from "~/app/types/routes";
import Breadcrumbs from "~/components/Breadcrumbs";
import CommentsSection from "~/components/commentSection";
import { Skeleton } from "~/components/ui/skeleton";
import DifficultyConsensus from "~/components/difficulty-consensus";
import routesData from "~/data/routes.json";
import RouteTags from "~/components/route-tags";
import { uniqueInfoValues as ClimbingStyleMap } from "@/data/info-to-climbing-style";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function RoutePage() {
  const { sector: sectorSlug, route: routeSlug } = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find the route in the nested data structure
  const route = routesData.headlands
    .flatMap((headland) => headland.sectors)
    .find((s) => s.slug === sectorSlug)
    ?.routes.find((r) => r.slug === routeSlug) as Route | undefined;

  if (!route) {
    notFound();
  }
  const currentSector = routesData.headlands
  .flatMap((headland) => headland.sectors)
  .find((s) => s.slug === sectorSlug);

  // Get the index of the current route in the sector
  const currentRouteIndex = currentSector?.routes.findIndex(
  (r) => r.slug === routeSlug
);
  
  // Determine the previous and next routes
  const prevRoute = currentRouteIndex > 0 ? currentSector?.routes[currentRouteIndex - 1] : null;
  const nextRoute = currentRouteIndex < (currentSector?.routes.length - 1) 
    ? currentSector?.routes[currentRouteIndex + 1] 
    : null;
  
  return (
  <div className="container mx-auto max-w-screen-xl px-4 py-4">
    <Breadcrumbs />
    <div className="flex justify-between w-full mb-4">
      {prevRoute ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/sectors/${sectorSlug}/${prevRoute.slug}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous: {prevRoute.name}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: None
        </Button>
      )}
      
      {nextRoute ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/sectors/${sectorSlug}/${nextRoute.slug}`}>
            Next: {nextRoute.name}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next: None
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <div className="mb-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-bold">{route.name}</h1>
            <div className="flex items-center gap-2">
              {route.stars ? (
                <span className="flex">
                  {[...Array(route.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </span>
              ) : (
                ""
              )}
              <span className="text-bg-secondary text-3xl font-bold">
                {route.grade}
              </span>
            </div>
          </div>
          <span className="text-sm text-gray-400 font-style:italic">
            {route.first_ascent} - {route.date}
          </span>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Style:</strong> {ClimbingStyleMap.get(route.info)}
          </p>
          <p>
            <strong>Info:</strong> {route.info.replace("\(", "").replace("\)", "") }
          </p>
          <p>
            <strong>Description:</strong> {route.description}
          </p>
        </div>
        <div className="hidden md:block w-full flex-col gap-2 pt-2">
          <RouteTags specifiedTags={route.tags} />
          <DifficultyConsensus />
        </div>
      </div>

      <div className="order-1 md:order-2 relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src="/images/mockRoute.jpg"
          alt={`${route.name} route`}
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
      
      <div className="order-3 col-span-1 md:col-span-2">
        <div className="flex md:hidden w-full flex-col gap-2">
          <RouteTags specifiedTags={route.tags} />
          <DifficultyConsensus />
        </div>
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentsSection routeSlug={route.slug} />
        </Suspense>
      </div>
    </div>
  </div>
);
