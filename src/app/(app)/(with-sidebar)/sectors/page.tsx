"use client";
import { useState, useEffect, useContext } from "react";
import { getAllSectorsWithMetaData } from "~/server/models/sectors";
import type { SectorData as Sector } from "~/server/models/sectors";
import type { Headland } from "~/server/models/headlands";

import SectorCard from "~/components/SectorCard";
import Breadcrumbs from "~/components/Breadcrumbs";
import SkeletonCarousel from "~/components/SkeletonCarousel";
import AcknowledgementsModal from "~/components/AcknowledgementsModal";

import { getAllHeadlands } from "~/server/models/headlands";
import { LoadingContext } from "~/contexts/sector-loading-context";
type gradeBucket = {
  name: string;
  count: number;
};
interface SectorMetaData extends Sector {
  headlandId: number;
  gradeBuckets: gradeBucket[];
  routeTypes: string[];
}

export default function SectorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [headlands, setHeadlands] = useState<Headland[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [processedSectors, setProcessedSectors] = useState<SectorMetaData[]>(
    [],
  );
  const { setChildrenLoaded } = useContext(LoadingContext);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [headlandsData, sectorsData] = await Promise.all([
          getAllHeadlands(),
          getAllSectorsWithMetaData(),
        ]);

        const orderedHeadlands = headlandsData.sort((a, b) =>
          a.name.slice(0, 1).localeCompare(b.name.slice(0, 1)),
        );

        setHeadlands(orderedHeadlands);
        setSectors(sectorsData);
        setProcessedSectors(sectorsData);
        setChildrenLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [setChildrenLoaded]);

  // Modal logic - simplified
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
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
      {headlands.map((headland) => (
        <div key={headland.slug} className="mb-12 w-full">
          <h2 className="mb-6 text-2xl font-semibold">{headland.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processedSectors
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
