let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');
const valves = new Map();
parsed.forEach((line) => {
  const split = line.split(' ');
  const name = split[1];
  const rate = +split[4].split('=')[1].replace(';', '');

  const neighbors = line.split(';')[1]
    .replace('tunnels lead to valves', '')
    .replace('tunnel leads to valve', '')
    .trim().split(',').map(el => el.trim());
  valves.set(name, {
    name,
    rate,
    neighbors,
  });
});
const valveNames = Array.from(valves.keys());

function getDistanceTo(valveName, target) {
  if (valveName === target) {
    return 0;
  }
  const root = valves.get(valveName);
  const visited = new Set();
  const queue = [...root.neighbors.map(el => ({valveName: el, distance: 1}))];
  while (queue.length > 0) {
    const current = queue.shift();
    visited.add(current.valveName);
    // End condition
    if (current.valveName === target) {
      return current.distance;
    }
    // Go to neighbors
    for (const neighbor of valves.get(current.valveName).neighbors) {
      if (visited.has(neighbor)) {
        continue;
      }
      queue.push({
        valveName: neighbor,
        distance: current.distance + 1,
      });
    }
  }
}

valveNames.forEach((valveName) => {
  const current = valves.get(valveName);
  current.distances = new Map();
  valveNames.forEach((target) => {
    if (target === current.name) {
      return;
    }
    const distanceToTarget = getDistanceTo(current.name, target);
    current.distances.set(target, distanceToTarget)
  });
});
const workingValveNames = valveNames.filter((valveName) => {
  const current = valves.get(valveName);
  return current.rate > 0;
})
// console.log(valves, workingValveNames);


const cache = new Map();
function dfs(time, locationValveName, openedValves) {
  const key = `${time},${locationValveName},${openedValves.join('-')}`;
  if (cache.has(key)) {
    return cache.get(key)
  }

  let maxPressureReleased = 0;
  // End condition
  if (time <= 0) {
    return maxPressureReleased;
  }
  // Because we start on a not working valve we go to the next working valve and open it
  for (const workingValveName of workingValveNames) {
    if (locationValveName === workingValveName || openedValves.includes(workingValveName)) {
      continue;
    }
    const nextValve = valves.get(workingValveName);
    const d = nextValve.distances.get(locationValveName);
    const remainingTime = time - d - 1; // -1 because we will open the valve
    const ans = dfs(remainingTime, workingValveName, [...openedValves, workingValveName].sort())
      + (remainingTime * nextValve.rate);
    maxPressureReleased = Math.max(maxPressureReleased, ans);
  }
  cache.set(key, maxPressureReleased);
  return maxPressureReleased;
}

(function part1() {
  const maxPressureReleased = dfs(30, 'AA', []);
  console.log({part1: maxPressureReleased});
})(); // ans === 1923

(function part2() {
  const allWorkingValvesSubSets = getAllSubsetsFromArray(workingValveNames);

  let maxPressureReleased = 0;
  for (const subSet of allWorkingValvesSubSets) {
    const human = dfs(26, 'AA', subSet);
    const elephant = dfs(26, 'AA', getInvertedSubset(subSet));
    maxPressureReleased = Math.max(maxPressureReleased, human + elephant);
  }
  console.log({part2: maxPressureReleased});

  function getInvertedSubset(subSet) {
    return [...workingValveNames].filter(name => !subSet.includes(name));
  }

  function getAllSubsetsFromArray(arr) {
    const allSubSets = [[]]; // start with empty set
    arr.forEach((el) => {
      allSubSets.forEach((subSet) => {
        allSubSets.push([el, ...subSet]);
      })
    });
    return allSubSets;
  }
})(); // part 2: 2500 < ans = 2594 < 2600