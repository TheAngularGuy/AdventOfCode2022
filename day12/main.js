let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

let grid = []; //string[][]
let startingPosition = {x: 0, y: 0};
let endingPosition = {x: 0, y: 0};

parsed.forEach((line, y) => {
  const row = [];
  line.split('').forEach((char, x) => {
    let num = char.charCodeAt(0) - 97;
    if (char === 'S') {
      startingPosition.x = x;
      startingPosition.y = y;
      num = 'a'.charCodeAt(0) - 97;
    } else if (char === 'E') {
      endingPosition.x = x;
      endingPosition.y = y;
      num = 'z'.charCodeAt(0) - 97;
    }
    row.push(num);
  });
  grid.push(row);
});
console.log('startingPosition:', startingPosition);
console.log('endingPosition:', endingPosition);


let open = [];
let closed = [];

function findQuickestPath() {
  // Video that helped me a lot with A star algorithm https://www.youtube.com/watch?v=-L-WgKMFuhE
  while (true) {
    const current = open.shift();
    if (!current) {
      return null;
    }
    closed.push(current);
    if (current.poz.x === endingPosition.x && current.poz.y === endingPosition.y) {
      return current.sd;
    }

    const voisins = [];
    let voisinPotentielPoz;

    function addVoisin() {
      if (grid[voisinPotentielPoz.y]?.[voisinPotentielPoz.x] !== undefined &&
        grid[voisinPotentielPoz.y][voisinPotentielPoz.x] - grid[current.poz.y][current.poz.x] <= 1 &&
        !closed.filter((el => el.poz.y === voisinPotentielPoz.y && el.poz.x === voisinPotentielPoz.x)).length
      ) {
        voisins.push({
          poz: {x: voisinPotentielPoz.x, y: voisinPotentielPoz.y},
          previous: current,
          sd: current.sd + 1,
          ed: Math.sqrt(
            Math.pow(Math.abs(voisinPotentielPoz.x - endingPosition.x), 2) +
            Math.pow(Math.abs(voisinPotentielPoz.y - endingPosition.y), 2)),
        })
      }
    }

    voisinPotentielPoz = {x: current.poz.x, y: current.poz.y - 1};
    addVoisin();
    voisinPotentielPoz = {x: current.poz.x, y: current.poz.y + 1};
    addVoisin();
    voisinPotentielPoz = {x: current.poz.x - 1, y: current.poz.y};
    addVoisin();
    voisinPotentielPoz = {x: current.poz.x + 1, y: current.poz.y};
    addVoisin();

    function sortOpen() {
      open.sort((a, b) => {
        if ((a.sd + a.ed) === (b.sd + b.ed)) {
          return a.ed - b.ed;
        }
        return (a.sd + a.ed) - (b.sd + b.ed);
      });
    }

    voisins.forEach((voisin) => {
      let found = false;
      open.forEach((el) => {
        if (el.poz.y === voisin.poz.y && el.poz.x === voisin.poz.x) {
          found = true;
          el.sd = Math.min(el.sd, voisin.sd);
          el.ed = Math.min(el.ed, voisin.ed);
          sortOpen();
        }
      });
      if (!found) {
        open.push(voisin);
        sortOpen();
      }
    });
  }
}


// Part 1
const distanceStartEnd = Math.abs(startingPosition.x - endingPosition.x) +
  Math.abs(startingPosition.y - endingPosition.y)
open = [{poz: startingPosition, ed: distanceStartEnd, sd: 0, previous: null}];
closed = [];
console.log('Part1: ', findQuickestPath());


// part 2
const allStartingPositions = [];
const maxCases = grid[0].length * grid.length;
const visitedHash = {};
let visited = 0;
let x1 = endingPosition.x - 1;
let x2 = endingPosition.x + 1;
let y1 = endingPosition.y - 1;
let y2 = endingPosition.y + 1;
while (visited < maxCases - 1) {
  for (let i = y1; i <= y2; i++) {
    for (let j = x1; j <= x2; j++) {
      if (grid[i]?.[j] === undefined || visitedHash[`${j},${i}`]) {
        continue;
      }
      if (grid[i][j] === 0) {
        allStartingPositions.push({y: i, x: j});
      }
      visitedHash[`${j},${i}`] = true;
      visited++;
    }
  }
  x1--;
  y1--;
  x2++;
  y2++;
}
console.log('allStartingPositions:', allStartingPositions.length);

const foundPaths = [];
allStartingPositions.forEach((s) => {
  const distanceStartEnd = Math.abs(s.x - endingPosition.x) +
    Math.abs(s.y - endingPosition.y)
  open = [{poz: s, ed: distanceStartEnd, sd: 0, previous: null}];
  closed = [];
  const path = findQuickestPath();
  if (path !== null) {
    foundPaths.push(path);
    foundPaths.sort((a, b) => a - b);
    console.log('found', path, 'min:', foundPaths[0]);
  }
});
console.log('Part2: ', foundPaths[0]);








