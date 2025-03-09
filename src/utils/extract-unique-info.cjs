const fs = require('fs');

function extractUniqueInfoValues(filePath) {
  try {
    // Read the file
    const data = fs.readFileSync(filePath, 'utf8');
    const routesData = JSON.parse(data);
    
    // Create a Set to store unique info values
    const uniqueInfoValues = new Set();
    
    // Track how many routes have the info field
    let routesWithInfo = 0;
    let totalRoutes = 0;
    
    // Iterate through all headlands
    for (const headland of routesData.headlands) {
      // Iterate through all sectors in each headland
      for (const sector of headland.sectors) {
        // Iterate through all routes in each sector
        for (const route of sector.routes) {
          totalRoutes++;
          
          // Add the info value to our Set if it exists and isn't null
          if (route.info !== undefined && route.info !== null) {
            uniqueInfoValues.add(route.info);
            routesWithInfo++;
          }
        }
      }
    }
    
    // Convert Set to Array for easier display and sorting
    const uniqueInfoArray = Array.from(uniqueInfoValues).sort();
    
    // Log the results
    console.log(`Found ${uniqueInfoArray.length} unique info values across ${routesWithInfo} routes (out of ${totalRoutes} total routes):`);
    console.log(uniqueInfoArray);
    
    // Write the unique values to a file
    const outputPath = 'unique_info_values.json';
    fs.writeFileSync(outputPath, JSON.stringify(uniqueInfoArray, null, 2), 'utf8');
    
    console.log(`\nUnique info values saved to ${outputPath}`);
    return uniqueInfoArray;
  } catch (error) {
    console.error('Error processing the file:', error);
    return [];
  }
}

// Run the function with the routes.json file
const filePath = 'routes.json';
extractUniqueInfoValues(filePath);
