let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');


let points = new Map();
let orderToCheck = ['N', 'S', 'W', 'E'];


function init() {
  points = new Map();
  orderToCheck = ['N', 'S', 'W', 'E'];
  parsed.forEach((line, y) => {
    line.split('').forEach((c, x) => {
      if (c === '#') {
        points.set(`${x},${y}`, true);
      }
    })
  });
}


function shuffleOrderToCheck() {
  const first = orderToCheck.shift();
  orderToCheck.push(first);
}

function hasNeighboursNorth(x, y) {
  return points.has(`${x},${y - 1}`) ||
    points.has(`${x + 1},${y - 1}`) ||
    points.has(`${x - 1},${y - 1}`);
}
function hasNeighboursSouth(x, y) {
  return points.has(`${x},${y + 1}`) ||
    points.has(`${x + 1},${y + 1}`) ||
    points.has(`${x - 1},${y + 1}`);
}
function hasNeighboursWest(x, y) {
  return points.has(`${x - 1},${y}`) ||
    points.has(`${x - 1},${y - 1}`) ||
    points.has(`${x - 1},${y + 1}`);
}
function hasNeighboursEast(x, y) {
  return points.has(`${x + 1},${y}`) ||
    points.has(`${x + 1},${y - 1}`) ||
    points.has(`${x + 1},${y + 1}`);
}
function hasNeighbours(x, y) {
  return hasNeighboursNorth(x, y) ||
    hasNeighboursSouth(x, y) ||
    hasNeighboursWest(x, y) ||
    hasNeighboursEast(x, y);
}



function solve(maxRounds = +Infinity) {
  let round = 1;
  while (true) {
    if (round > maxRounds) {
      break;
    }

    const propositions = new Map();
    points.forEach((v, k) => {
      const [x, y] = k.split(',').map(el => +el);
      const hasNeighboursBool = hasNeighbours(x, y);
      if (hasNeighboursBool) {
        for (const dir of orderToCheck) {
          if (dir === 'N' && !hasNeighboursNorth(x, y)) {
            const key = `${x},${y - 1}`;
            propositions.set(key, [...(propositions.get(key) || []), [x, y]]);
            break;
          }
          if (dir === 'S' && !hasNeighboursSouth(x, y)) {
            const key = `${x},${y + 1}`;
            propositions.set(key, [...(propositions.get(key) || []), [x, y]]);
            break;
          }
          if (dir === 'W' && !hasNeighboursWest(x, y)) {
            const key = `${x - 1},${y}`;
            propositions.set(key, [...(propositions.get(key) || []), [x, y]]);
            break;
          }
          if (dir === 'E' && !hasNeighboursEast(x, y)) {
            const key = `${x + 1},${y}`;
            propositions.set(key, [...(propositions.get(key) || []), [x, y]]);
            break;
          }
        }
      }
    });

    let elvesMoves = 0;
    propositions.forEach((v, k) => {
      const [x, y] = k.split(',').map(el => +el);
      const listOfPoints = v;
      if (listOfPoints.length !== 1) {
        return;
      }
      const [px, py] = listOfPoints[0];
      points.delete(`${px},${py}`);
      points.set(`${x},${y}`, true);
      elvesMoves++;
    });
    if (elvesMoves === 0) {
      break;
    }
    shuffleOrderToCheck();
    round++;
  }

  const allXPoints = []
  const allYPoints = []
  points.forEach((v, k) => {
    const [x, y] = k.split(',').map(el => +el);
    allXPoints.push(x);
    allYPoints.push(y);
  });
  const minX = Math.min(...allXPoints);
  const maxX = Math.max(...allXPoints);
  const minY = Math.min(...allYPoints);
  const maxY = Math.max(...allYPoints);

  let sumEmpty = 0;
  for (let i = minY; i <= maxY; i++) {
    for (let j = minX; j <= maxX; j++) {
      if (!points.has(`${j},${i}`)) {
        sumEmpty++;
      }
    }
  }
  return [sumEmpty, round];
}

(function part1() {
  init();
  const ans = solve(10);
  console.log({part1: ans[0]}); // 3925
})();

(function part2() {
  init();
  const ans = solve();
  console.log({part2: ans[1]}); // 903
})();