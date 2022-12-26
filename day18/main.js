let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

let rockPositions = new Set()
let rocks = parsed.map((line) => {
  const poz = line.trim().split(',').map(el => parseInt(el));
  rockPositions.add(`${poz[0]},${poz[1]},${poz[2]}`);
  return poz;
});


const adjacentPositionsDeltas = [
  [-1, 0, 0], // left
  [1, 0, 0],  // right
  [0, -1, 0], // bottom
  [0, 1, 0],  // top
  [0, 0, -1], // in front
  [0, 0, 1],  // behind
];


const min = Math.min(...rocks.map(rock => Math.min(rock[0], rock[1], rock[2])));
const max = Math.max(...rocks.map(rock => Math.max(rock[0], rock[1], rock[2])));

let cache = new Map();
function isPositionReachableFromOutside(poz, visited = new Set()) { // poz: [x, y, z]
  const key = `${poz[0]},${poz[1]},${poz[2]}`
  if (cache.has(key)) {
    return cache.get(key);
  }

  if (rockPositions.has(key) || visited.has(key)) {
    return false;
  }
  visited.add(key);

  if (
    poz[0] < min || poz[0] > max ||
    poz[1] < min || poz[1] > max ||
    poz[2] < min || poz[2] > max
  ) {
    return true;
  }

  for (const delta of adjacentPositionsDeltas) {
    const adjacentPoz = [
      poz[0] + delta[0],
      poz[1] + delta[1],
      poz[2] + delta[2],
    ];
    const foundPath = isPositionReachableFromOutside(adjacentPoz, visited);
    if (foundPath) {
      return true;
    }
  }

  return false;
}


(function () {
  let exposedFaces = 0;
  let exposedFacesThatAreReachableFromOutside = 0;
  for (const rock of rocks) {
    for (const delta of adjacentPositionsDeltas) {
      const adjacentPoz = [
        rock[0] + delta[0],
        rock[1] + delta[1],
        rock[2] + delta[2],
      ];
      if (rockPositions.has(`${adjacentPoz[0]},${adjacentPoz[1]},${adjacentPoz[2]}`) === false) {
        // Part 1
        exposedFaces += 1;

        if (isPositionReachableFromOutside(adjacentPoz)) {
          // Part 2
          exposedFacesThatAreReachableFromOutside += 1;
        }
      }
    }
  }
  console.log({part1: exposedFaces}); //4636
  console.log({part2: exposedFacesThatAreReachableFromOutside}); // 2572
})();
