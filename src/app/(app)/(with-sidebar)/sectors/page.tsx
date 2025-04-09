"use client";
import { useState, useEffect } from "react";

import SectorCard from "~/components/SectorCard";
import Breadcrumbs from "~/components/Breadcrumbs";
import SkeletonCarousel from "~/components/SkeletonCarousel";
import AcknowledgementsModal from "~/components/AcknowledgementsModal";

import { useHeadlandAndSector } from "@/contexts/headland-sector-context";
async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default function SectorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { headlands, sectors } = useHeadlandAndSector();
  const orderedHeadlands = headlands.sort((a, b) =>
    a.name.slice(0, 1).localeCompare(b.name.slice(0, 1)),
  );
  useEffect(() => {
    try {
      const hasVisitedBefore = localStorage.getItem("hasVisitedSectorsPage");
      if (!hasVisitedBefore) {
        setIsModalOpen(true);
        localStorage.setItem("hasVisitedSectorsPage", "true");
      }
    } catch (error) {
      console.error("localStorage error:", error);
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const wait = async () => {
      await waitFor(1000);
      console.log("Waited for 1 second");
    };
    void wait();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-xl px-4">
      <Breadcrumbs />
      <AcknowledgementsModal
        onOpenChange={setIsModalOpen}
        isOpen={isModalOpen}
      />

      <div className="mb-4">
        <h1 className="mb-2 text-3xl font-bold">Climbing Sectors</h1>
        <p className="text-muted-foreground">
          {sectors.length} sectors across {headlands.length} headlands
        </p>
      </div>

      <div className="mb-8 w-full overflow-hidden">
        <h2 className="mb-4 text-2xl font-semibold">Featured Routes</h2>
        <SkeletonCarousel />
      </div>

      {/* Group sectors by headland */}
      {orderedHeadlands.map((headland) => (
        <div key={headland.slug} className="mb-12 w-full">
          <h2 className="mb-6 text-2xl font-semibold">{headland.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sectors
              .filter((sector) => sector.headlandId === headland.id)
              .map((sector) => (
                <SectorCard
                  key={sector.slug}
                  name={sector.name}
                  slug={sector.slug}
                  gradeBuckets={sector.gradeBuckets}
                  routeTypes={sector.routeTypes}
                  // totalRoutes={sector.totalRoutes}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
