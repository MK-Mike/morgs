/**
 * Selects a consistent subset of comments based on the route slug
 * @param comments - The full array of comments
 * @param routeSlug - The route slug used as seed for selection
 * @returns A subset of comments that will be consistent for the same route
 */
export function selectCommentsForRoute(
  comments: any[],
  routeSlug: string,
): any[] {
  // Create a hash from the route slug to use as a seed
  const hashCode = createHashFromString(routeSlug);

  // Determine how many comments to show (between 5 and 15)
  const commentCount = 5 + (hashCode % 11);

  // Create a predictable shuffled array of indices
  const indices = Array.from({ length: comments.length }, (_, i) => i);
  const shuffledIndices = shuffleWithSeed(indices, hashCode);

  // Take the first N indices after shuffling
  const selectedIndices = shuffledIndices.slice(0, commentCount);

  // Sort selected indices to maintain chronological order
  selectedIndices.sort((a, b) => a - b);

  // Return the selected comments
  return selectedIndices.map((index) => comments[index]);
}

/**
 * Creates a numeric hash from a string
 * @param str - Input string
 * @returns A number hash
 */
function createHashFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Shuffles an array using a seed for deterministic results
 * @param array - The array to shuffle
 * @param seed - Numeric seed for deterministic shuffling
 * @returns Shuffled array
 */
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;

  // Fisher-Yates shuffle with seeded randomness
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate next pseudorandom number
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const rnd = currentSeed / 233280;

    // Pick element for swapping
    const j = Math.floor(rnd * (i + 1));

    // Swap elements
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
