// 🎨 Predefined set of colors (can expand later)
const COLOR_POOL = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
  "brown",
  "teal",
  "lime",
  "indigo",
  "violet",
  "gray",
  "black",
];

// Function to shuffle an array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Generate colors for a stage
 * @param {Number} totalColors - how many colors in this stage
 * @param {Number} phishingCount - how many phishing traps
 */
export function generateStageColors(totalColors, phishingCount) {
  // Pick random colors from pool
  let selected = shuffle([...COLOR_POOL]).slice(0, totalColors);

  // Convert into objects with phishing flags
  let colors = selected.map((c) => ({ color: c, isPhishing: false, clicked: false }));

  // Randomly assign phishing spots
  let phishingIndexes = [];
  while (phishingIndexes.length < phishingCount) {
    let randIndex = Math.floor(Math.random() * totalColors);
    if (!phishingIndexes.includes(randIndex)) {
      phishingIndexes.push(randIndex);
      colors[randIndex].isPhishing = true;
    }
  }

  return colors;
}
