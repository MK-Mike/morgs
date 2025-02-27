"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Route } from "~/app/types/routes";
import Breadcrumbs from "~/components/Breadcrumbs";
import CommentsSection from "~/components/commentSection";
import { Skeleton } from "~/components/ui/skeleton";
import routesData from "~/data/routes.json";

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
    <div className="container mx-auto py-8">
      <Breadcrumbs />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h1 className="mb-6 text-3xl font-bold">{route.name}</h1>
          <div className="space-y-4">
            <p>
              <strong>Grade:</strong> {route.grade}
            </p>
            <p>
              <strong>Stars:</strong>{" "}
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
                "Not rated"
              )}
            </p>
            <p>
              <strong>Type:</strong> {route.info}
            </p>
            <p>
              <strong>Description:</strong> {route.description}
            </p>
            <p>
              <strong>First Ascent:</strong> {route.first_ascent}
            </p>
            <p>
              <strong>Date:</strong> {route.date}
            </p>
          </div>
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
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
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentsSection routeSlug={route.slug} />
        </Suspense>
      </div>
    </div>
  );
}
