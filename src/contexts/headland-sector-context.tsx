"use client";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { Headland } from "@/server/models/headlands";
import type { SectorMetaData } from "@/server/models/sectors";

interface HeadlandAndSectorContextProps {
  headlands: Headland[];
  sectors: SectorMetaData[];
}

// Create context with a default value
const HeadlandAndSectorContext = createContext<HeadlandAndSectorContextProps>({
  headlands: [],
  sectors: [],
});

// Custom hook for easier consumption
export const useHeadlandAndSector = () => {
  const context = useContext(HeadlandAndSectorContext);
  if (!context) {
    throw new Error(
      "useHeadlandAndSector must be used within a HeadlandAndSectorProvider",
    );
  }
  return context;
};

interface HeadlandAndSectorProviderProps {
  children: ReactNode;
  headlands: Headland[];
  sectors: SectorMetaData[];
}

// Simplified Provider component
export const HeadlandAndSectorProvider = (
  props: HeadlandAndSectorProviderProps,
) => {
  const contextValue = {
    headlands: props.headlands,
    sectors: props.sectors,
  };

  return (
    <HeadlandAndSectorContext.Provider value={contextValue}>
      {props.children}
    </HeadlandAndSectorContext.Provider>
  );
};

// Export the context
export { HeadlandAndSectorContext };
