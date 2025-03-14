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
  return (
  <div className="container mx-auto max-w-screen-xl px-4 py-4">
    <Breadcrumbs />
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
          <span className="text-sm text-gray-500">
            {route.first_ascent} - {route.date}
          </span>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Style:</strong> {ClimbingStyleMap.get(route.info)}
          </p>
          <p>
            <strong>Info:</strong> {route.info}
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
