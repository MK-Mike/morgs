"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Route } from "~/app/types/routes";
import Breadcrumbs from "~/components/Breadcrumbs";
import CommentsSection from "~/components/commentSection";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import routesData from "~/data/routes.json";

function generateTags() {
  const tagsList = ["pumpy", "run out", "technical", "slabby", "juggy"];

  // Randomly decide whether to include tags (50% chance)
  if (Math.random() < 0.5) {
    return []; // No tags
  }

  // Generate a random number of tags (1 to 3)
  const numberOfTags = Math.floor(Math.random() * 3) + 1;

  // Shuffle the tags and select a subset
  const selectedTags = tagsList
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfTags);

  return selectedTags;
}
//mapping for tag colours
const tagColours = new Map([
  ["pumpy", "emerald"],
  ["run out", "rose"],
  ["technical", "yellow"],
  ["slabby", "sky"],
  ["juggy", "pink"],
]);

const tags = generateTags();

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
    <div className="conatiner mx-auto max-w-screen-xl px-4 py-4">
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
              <strong>Date of First Ascent:</strong> {route.date}
            </p>
            {tags.length > 0 && (
              <div className="flex justify-start gap-2">
                <p>
                  <strong>Tags: </strong>
                  {tags.map((tag: string) => {
                    return (
                      <Badge
                        className="m-1"
                        key={tag}
                        variant={tagColours.get(tag)}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </p>
              </div>
            )}
            <Button variant="secondary" asChild>
              <p> add tag(s)</p>
            </Button>
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
