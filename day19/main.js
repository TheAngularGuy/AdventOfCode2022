let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

const maximumSpendingRatesPerBluePrint = [];
const bluePrints = [];
parsed.forEach((line) => {
  const parts = line.split(':')[1].split('.').map(el => el.split(' '));
  const oreRobot = {
    ore: parseInt(parts[0].at(-2)),
    clay: 0,
    obsidian: 0,
  };
  const clayRobot = {
    ore: parseInt(parts[1].at(-2)),
    clay: 0,
    obsidian: 0,
  };
  const obsidianRobot = {
    ore: parseInt(parts[2].at(-5)),
    clay: parseInt(parts[2].at(-2)),
    obsidian: 0,
  };
  const geodeRobot = {
    ore: parseInt(parts[3].at(-5)),
    clay: 0,
    obsidian: parseInt(parts[3].at(-2)),
  };
  bluePrints.push([oreRobot, clayRobot, obsidianRobot, geodeRobot])
  maximumSpendingRatesPerBluePrint.push([
    Math.max(oreRobot.ore, clayRobot.ore, obsidianRobot.ore, geodeRobot.ore),
    Math.max(oreRobot.clay, clayRobot.clay, obsidianRobot.clay, geodeRobot.clay),
    Math.max(oreRobot.obsidian, clayRobot.obsidian, obsidianRobot.obsidian, geodeRobot.obsidian),
    +Infinity,
  ]);
});

class SuperMap {
  sets;

  constructor() {
    this.sets = [new Map()]
  }

  set(k, v) {
    if (this.sets[this.sets.length - 1].size === 16776000) {
      this.sets.push(new Map());
    }
    return this.sets[this.sets.length - 1].set(k, v);
  }

  has(k) {
    for (const set of this.sets) {
      if (set.has(k)) {
        return true;
      }
    }
    return false;
  }

  get(k) {
    for (const set of this.sets) {
      const v = set.get(k)
      if (v !== undefined) {
        return v;
      }
    }
    return undefined;
  }
}


let dfsCache = new SuperMap();
// resources:   [ore, clay, obsidian, geode]
// ownedRobots: [ore, clay, obsidian, geode]
function dfs(bluePrintIndex, time, resources, ownedRobots) {
  const bluePrint = bluePrints[bluePrintIndex];
  const key = JSON.stringify([bluePrintIndex, time, resources, ownedRobots]);

  if (dfsCache.has(key)) {
    return dfsCache.get(key);
  }

  if (time === 0) {
    return resources[3];
  }

  let max = 0;
  for (let i = 3; i >= 0; i--) {
    if (
      resources[0] >= bluePrint[i].ore &&
      resources[1] >= bluePrint[i].clay &&
      resources[2] >= bluePrint[i].obsidian &&
      resources[i] - 1 <= maximumSpendingRatesPerBluePrint[bluePrintIndex][i]
    ) {
      const r = [...resources].map((r, i) => r + ownedRobots[i]);
      const bots = [...ownedRobots];

      r[0] -= bluePrint[i].ore;
      r[1] -= bluePrint[i].clay;
      r[2] -= bluePrint[i].obsidian;
      bots[i] += 1;

      const ans = dfs(bluePrintIndex, time - 1, r, bots);
      max = Math.max(max, ans);
    }
  }

  const r = resources.map((r, i) => r + ownedRobots[i]);
  const ans = dfs(bluePrintIndex, time - 1, r, ownedRobots);
  max = Math.max(max, ans);
  dfsCache.set(key, max);

  return max;
}


function part1() {
  let sum = 0;
  bluePrints.forEach((bluePrint, index) => {
    dfsCache = new SuperMap();
    const ans = dfs(index, 24, [0, 0, 0, 0], [1, 0, 0, 0]);
    console.log((index + 1), ans);
    sum += (index + 1) * ans;
  })
  console.log({part1: sum}); // ans = 1081
}
part1();

function part2() {
  dfsCache = new SuperMap();
  const ans1 = dfs(0, 32, [0, 0, 0, 0], [1, 0, 0, 0]);
  console.log(ans1);

  dfsCache = new SuperMap();
  const ans2 = dfs(1, 32, [0, 0, 0, 0], [1, 0, 0, 0]);
  console.log(ans2);

  dfsCache = new SuperMap();
  const ans3 = dfs(2, 32, [0, 0, 0, 0], [1, 0, 0, 0]);
  console.log(ans3);

  console.log({part2: ans1 * ans2 * ans3}); // ans = 2415
}
part2(); // warning ⚠️: pretty inefficient but gets the job done ~= 3m00s
