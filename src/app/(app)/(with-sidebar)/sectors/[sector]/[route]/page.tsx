"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Breadcrumbs from "~/components/Breadcrumbs";
import CommentsSection from "~/components/commentSection";
import DifficultyConsensus from "~/components/difficulty-consensus";
import RouteTags from "~/components/route-tags";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type { Route } from "~/server/models/routes";
import { getRouteBySlug, getRoutesInSector } from "~/server/models/routes";

export default function RoutePage() {
  const { sector: sectorSlug, route: routeSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [prevRoute, setPrevRoute] = useState<Route | null>(null);
  const [nextRoute, setNextRoute] = useState<Route | null>(null);
  const tags: string[] = ["pumpy", "technical"];
  if (!routeSlug) {
    notFound();
  }
  useEffect(() => {
    const fetchData = async () => {
      if (!routeSlug) return; // Guard clause

      setIsLoading(true);
      try {
        // Fetch the primary route
        const currentRoute: Route = await getRouteBySlug(String(routeSlug));
        setRoute(currentRoute);

        // Fetch other routes in the same sector after getting the sectorId
        const otherRoutes: Route[] = await getRoutesInSector(
          currentRoute.sectorId,
        );
        // Assuming server returns sorted data. If not, sort here:
        // const sortedRoutes = [...otherRoutes].sort((a, b) => a.routeNumber - b.routeNumber);
        const sortedRoutes = otherRoutes;

        const currentIndex = sortedRoutes.findIndex(
          (r) => r.slug === currentRoute.slug,
        );

        if (currentIndex !== -1) {
          setPrevRoute(
            currentIndex > 0 ? sortedRoutes[currentIndex - 1] : null,
          );
          setNextRoute(
            currentIndex < sortedRoutes.length - 1
              ? sortedRoutes[currentIndex + 1]
              : null,
          );
        }
      } catch (e) {
        console.error("Failed to fetch route data:", e);
        setIsLoading(false);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [routeSlug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-4">
      <Breadcrumbs />
      <div className="mb-4 flex w-full justify-between">
        {prevRoute ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/sectors/${String(sectorSlug)}/${prevRoute.slug}`}>
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
            <Link href={`/sectors/${String(sectorSlug)}/${nextRoute.slug}`}>
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
                    {Array.from({ length: route.stars }).map((_, i) => (
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
            <span className="font-style:italic text-sm text-gray-400">
              {route.firstAscent} - {String(route.date)}
            </span>
          </div>
          <div className="space-y-4">
            <p>
              <strong>Style:</strong> {route.routeStyle}
            </p>
            <p>
              <strong>Info:</strong>{" "}
              {route.info?.replace("\(", "").replace("\)", "")}
            </p>
            <p>
              <strong>Description:</strong> {route.description}
            </p>
          </div>
          <div className="hidden w-full flex-col gap-2 pt-2 md:block">
            <RouteTags specifiedTags={tags} />
            <DifficultyConsensus />
          </div>
        </div>

        <div className="relative order-1 aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted md:order-2">
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
          <div className="flex w-full flex-col gap-2 md:hidden">
            <RouteTags specifiedTags={tags} />
            <DifficultyConsensus />
          </div>
          <Suspense fallback={<div>Loading comments...</div>}>
            <CommentsSection routeSlug={route.slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
