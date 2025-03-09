const fs = require("fs");

// Function to generate random tags
function generateTags() {
  const tagsList = [
    "pumpy",
    "run out",
    "technical",
    "slabby",
    "juggy",
    "crimpy",
    "exposed",
    "vertical",
    "overhang",
    "sustained",
  ];

  // Randomly decide whether to include tags (50% chance)
  if (Math.random() < 0.5) {
    return []; // No tags
  }

  // Generate a random number of tags (1 to 3)
  const numberOfTags = Math.floor(Math.random() * 3) + 1;

  // Shuffle the tags and select a subset
  const shuffled = [...tagsList].sort(() => 0.5 - Math.random());
  const selectedTags = shuffled.slice(0, numberOfTags);

  return selectedTags;
}

// Main function to process the file
function addTagsToRoutes(filePath) {
  try {
    // Read the file
    const data = fs.readFileSync(filePath, "utf8");
    const routesData = JSON.parse(data);

    // Iterate through all headlands
    for (const headland of routesData.headlands) {
      // Iterate through all sectors in each headland
      for (const sector of headland.sectors) {
        // Iterate through all routes in each sector
        for (const route of sector.routes) {
          // Add tags field to each route
          route.tags = generateTags();
        }
      }
    }

    // Write the updated data back to a new file
    const outputPath = "routes_with_tags.json";
    fs.writeFileSync(outputPath, JSON.stringify(routesData, null, 2), "utf8");

    console.log(`Tags added successfully! Output saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error processing the file:", error);
  }
}

// Run the function with the routes.json file
const filePath = "../data/routes.json";
addTagsToRoutes(filePath);
