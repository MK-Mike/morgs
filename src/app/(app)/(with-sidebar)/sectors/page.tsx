"use client";
import type { Route, Sector, Headland, RoutesData } from "@/app/types/routes";
import { useState, useEffect } from "react";
import routesData from "@/data/routes.json";

import SectorCard from "~/components/SectorCard";
import Breadcrumbs from "~/components/Breadcrumbs";
import SkeletonCarousel from "~/components/SkeletonCarousel";
import AcknowledgementsModal from "~/components/AcknowledgementsModal";
const data: RoutesData = routesData as RoutesData;

export default function SectorsPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle localStorage and data processing after component is mounted
  useEffect(() => {
    if (!isMounted) return;

    // Process sectors data
    const processedSectors = data.headlands.flatMap((headland: Headland) =>
      headland.sectors.map((sector: Sector) => {
        const gradeBuckets = [
          { label: "Easy (0-16)", color: "#4CAF50", count: 0 },
          { label: "Medium (17-24)", color: "#2196F3", count: 0 },
          { label: "Hard (25-32)", color: "#F44336", count: 0 },
          { label: "Very Hard (33+)", color: "#212121", count: 0 },
        ];

        // Count routes in each grade bucket
        sector.routes.forEach((route: Route) => {
          const grade: number = parseInt(route.grade);
          if (grade <= 16) gradeBuckets[0].count++;
          else if (grade <= 24) gradeBuckets[1].count++;
          else if (grade <= 32) gradeBuckets[2].count++;
          else gradeBuckets[3].count++;
        });

        // Process route types
        const routeTypes = [
          ...new Set(
            sector.routes.map((route) =>
              route.info.replace(/[()]/g, "").trim(),
            ),
          ),
        ]
          .filter(
            (type) =>
              type === "T" ||
              type === "S" ||
              type === "solo" ||
              /\d+[B]/.test(type),
          )
          .map((type) => {
            if (type === "T") return "trad";
            if (type === "S" || type === "solo") return "solo";
            if (/\d+[B]/.test(type)) return "sport";
            return type;
          });

        return {
          name: sector.name,
          slug: sector.slug,
          description: sector.description,
          gradeBuckets,
          routeTypes,
          totalRoutes: sector.routes.length,
          headland: headland.name,
        };
      }),
    );

    setSectors(processedSectors);

    try {
      // Check if user has visited before
      const hasVisitedBefore = localStorage.getItem("hasVisitedSectorsPage");

      if (!hasVisitedBefore) {
        setIsModalOpen(true);
        localStorage.setItem("hasVisitedSectorsPage", "true");
      }
    } catch (error) {
      // Handle any localStorage errors
      console.error("localStorage error:", error);
      // Fallback behavior - show modal if localStorage fails
      setIsModalOpen(true);
    }
  }, [isMounted]);

  return (
    <div className="container mx-auto max-w-screen-xl">
      <Breadcrumbs />
      <AcknowledgementsModal
        onOpenChange={setIsModalOpen}
        isOpen={isModalOpen}
      />

      <div className="mb-4">
        <h1 className="mb-2 text-3xl font-bold">Climbing Sectors</h1>
        <p className="text-muted-foreground">
          {sectors.length} sectors across {data.headlands.length} headlands
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Featured Routes</h2>
        <SkeletonCarousel />
      </div>

      {/* Group sectors by headland */}
      {data.headlands.map((headland) => (
        <div key={headland.slug} className="mb-12 w-full overflow-y-auto">
          <h2 className="mb-6 text-2xl font-semibold">{headland.name}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sectors
              .filter((sector) => sector.headland === headland.name)
              .map((sector) => (
                <SectorCard
                  key={sector.slug}
                  name={sector.name}
                  slug={sector.slug}
                  description={sector.description}
                  gradeBuckets={sector.gradeBuckets}
                  routeTypes={sector.routeTypes}
                  totalRoutes={sector.totalRoutes}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
