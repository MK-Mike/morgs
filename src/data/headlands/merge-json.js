#!/usr/bin/env node
import fs from "fs";
/**
 * Processes a single JSON file with climbing route data in format
 * {"data": [{"headlands": [...]},...]}
 * Handles duplicates at headland, sector, and route levels using slug fields
 */

// Get input and output file paths from command line arguments
const inputFilePath = process.argv[2];
const outputPath = process.argv[3] || "merged-routes.json";

if (!inputFilePath) {
  console.error("Error: Please provide an input file path");
  console.error(
    "Usage: node process-json.js <input-file.json> [output-file.json]",
  );
  process.exit(1);
}

// Check if input file exists
if (!fs.existsSync(inputFilePath)) {
  console.error(`Error: File "${inputFilePath}" does not exist`);
  process.exit(1);
}

// Initialize merged data structure
const mergedData = { headlands: [] };

try {
  // Read and parse the input file
  const fileContent = fs.readFileSync(inputFilePath, "utf8");
  const fileData = JSON.parse(fileContent);

  // Check if file has the expected structure
  if (!fileData.data || !Array.isArray(fileData.data)) {
    console.error(
      `Error: Input file does not have the expected {"data": [...]} structure`,
    );
    process.exit(1);
  }

  console.log(
    `Processing input file with ${fileData.data.length} data entries`,
  );

  // Process each data entry
  fileData.data.forEach((dataEntry, dataIndex) => {
    // Check if the data entry has the expected headlands structure
    if (!dataEntry.headlands || !Array.isArray(dataEntry.headlands)) {
      console.warn(
        `Warning: Data entry at index ${dataIndex} does not have a headlands array. Skipping.`,
      );
      return;
    }

    // Process each headland in this data entry
    dataEntry.headlands.forEach((headland, index) => {
      if (!headland.slug) {
        console.warn(
          `Warning: Found headland without slug at data index ${dataIndex}. Skipping.`,
        );
        return;
      }

      // Check if headland already exists
      const existingHeadlandIndex = mergedData.headlands.findIndex(
        (h) => h.slug === headland.slug,
      );

      if (existingHeadlandIndex === -1) {
        // New headland, add it
        mergedData.headlands.push(headland);
      } else {
        // Existing headland, merge sectors
        const existingHeadland = mergedData.headlands[existingHeadlandIndex];

        // Initialize sectors array if it doesn't exist
        if (!existingHeadland.sectors) {
          existingHeadland.sectors = [];
        }

        // Process each sector in the current headland
        if (headland.sectors && Array.isArray(headland.sectors)) {
          headland.sectors.forEach((sector) => {
            if (!sector.slug) {
              console.warn(
                `Warning: Found sector without slug in headland "${headland.slug}". Skipping.`,
              );
              return;
            }

            // Check if sector already exists
            const existingSectorIndex = existingHeadland.sectors.findIndex(
              (s) => s.slug === sector.slug,
            );

            if (existingSectorIndex === -1) {
              // New sector, add it
              existingHeadland.sectors.push(sector);
            } else {
              // Existing sector, merge routes
              const existingSector =
                existingHeadland.sectors[existingSectorIndex];

              // Initialize routes array if it doesn't exist
              if (!existingSector.routes) {
                existingSector.routes = [];
              }

              // Process each route in the current sector
              if (sector.routes && Array.isArray(sector.routes)) {
                sector.routes.forEach((route) => {
                  if (!route.slug) {
                    console.warn(
                      `Warning: Found route without slug in sector "${sector.slug}". Skipping.`,
                    );
                    return;
                  }

                  // Check if route already exists
                  const existingRouteIndex = existingSector.routes.findIndex(
                    (r) => r.slug === route.slug,
                  );

                  if (existingRouteIndex === -1) {
                    // New route, add it
                    existingSector.routes.push(route);
                  } else {
                    // Route already exists, skip it
                    console.log(`Skipping duplicate route: ${route.slug}`);
                  }
                });
              }
            }
          });
        }
      }
    });
  });

  // Write merged data to output file
  fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
  console.log(`Successfully processed data into "${outputPath}"`);

  // Print some stats
  console.log(`Total headlands: ${mergedData.headlands.length}`);
  const totalSectors = mergedData.headlands.reduce(
    (sum, h) => sum + (h.sectors?.length || 0),
    0,
  );
  console.log(`Total sectors: ${totalSectors}`);

  let totalRoutes = 0;
  mergedData.headlands.forEach((h) => {
    if (h.sectors) {
      h.sectors.forEach((s) => {
        totalRoutes += s.routes?.length || 0;
      });
    }
  });
  console.log(`Total routes: ${totalRoutes}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
