import fs from "fs";

// Map of unique info values to route types
export const uniqueInfoValues = new Map([
  ["", ""],
  ["1B&T", "trad"],
  ["2RB&T", "trad"],
  ["3RB&T", "trad"],
  ["4B&C", "sport"],
  ["4RB&T", "trad"],
  ["5B&C", "sport"],
  ["8B&C", "sport"],
  ["C only", "trad"],
  ["S", "solo"],
  ["Solo", "solo"],
  ["T&3RB", "trad"],
  ["T", "trad"],
  ["solo", "solo"],
]);

// Function to update the dataset with routeType
function addRouteTypeToRoutes(data) {
  // Iterate through each headland
  data.headlands.forEach((headland) => {
    // Iterate through each sector in the headland
    headland.sectors.forEach((sector) => {
      // Iterate through each route in the sector
      sector.routes.forEach((route) => {
        // Map the info field to the routeType using the uniqueInfoValues map
        const routeType = uniqueInfoValues.get(route.info) || "unknown";

        // Add the routeType field to the route
        route.routeType = routeType;
      });
    });
  });

  return data; // Return the updated dataset
}

// File paths
const inputFilePath = "./routes.json"; // Path to the input file
const outputFilePath = "./updatedData.json"; // Path to the output file

// Read, update, and write the dataset
fs.readFile(inputFilePath, "utf8", (err, fileData) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const data = JSON.parse(fileData);

    // Update the dataset
    const updatedData = addRouteTypeToRoutes(data);

    // Write the updated dataset back to the file system
    fs.writeFile(
      outputFilePath,
      JSON.stringify(updatedData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing the file:", err);
          return;
        }

        console.log(`Updated data written to ${outputFilePath}`);
      },
    );
  } catch (parseError) {
    console.error("Error parsing the JSON data:", parseError);
  }
});
