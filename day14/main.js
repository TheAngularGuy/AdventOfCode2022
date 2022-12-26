let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');
let grid;

function expandGridRight(max = 0) {
  const currentLen = grid[0].length;
  if (max >= currentLen) {
    for (let i = currentLen; i <= max; i++) {
      grid.forEach((line) => {
        if (line.every((c) => c === '#')) {
          // bottom line for part 2
          line.push('#');
          return;
        }
        line.push('.');
      });
    }
  }
}

function expandGridBottom(max = 0) {
  const currentLen = grid.length;
  if (max >= currentLen) {
    for (let i = currentLen; i <= max; i++) {
      grid.push(
        new Array(grid[0].length).fill(null).map((el) => '.')
      );
    }
  }
}

function drawHorizontalLine(a, b, y) {
  const x1 = Math.min(a, b);
  const x2 = Math.max(a, b);
  if (x1 === x2) {
    return;
  }
  for (let i = x1; i <= x2; i++) {
    grid[y][i] = '#';
  }
}

function drawVerticalLine(a, b, x) {
  const y1 = Math.min(a, b);
  const y2 = Math.max(a, b);
  if (y1 === y2) {
    return;
  }
  for (let i = y1; i <= y2; i++) {
    grid[i][x] = '#';
  }
}

function printGrid() {
  const tmp = grid[startingSandPoz[1]][startingSandPoz[0]];
  grid[startingSandPoz[1]][startingSandPoz[0]] = '+';
  grid.forEach(l => console.log(l.map(c => c === '.' ? ' ' : c).join('')));
  grid[startingSandPoz[1]][startingSandPoz[0]] = tmp;
  console.log('===');
}

function setupGrid() {
  grid = [['.']];
  parsed.forEach((line) => {
    const coords = line.split('->').map((el) => el.trim().split(',').map((nb) => +nb));
    for (let i = 0; i < coords.length - 1; i++) {
      let [x1, y1] = coords[i];
      let [x2, y2] = coords[i + 1];
      expandGridRight(Math.max(x1, x2));
      expandGridBottom(Math.max(y1, y2));
      if (x1 !== x2) {
        drawHorizontalLine(x1, x2, y1);
      }
      if (y1 !== y2) {
        drawVerticalLine(y1, y2, x1);
      }
    }
  });
}


function getNewSandCoord(poz) {
  const [x, y] = poz;
  if (grid[y + 1]?.[x] === undefined) {
    return -1;
  }
  if (grid[y + 1][x] !== '.') {
    if (grid[y + 1][x + 1] === undefined) {
      expandGridRight(grid[0].length + 1);
    }
    if (grid[y + 1][x - 1] === '.') {
      return getNewSandCoord([x - 1, y + 1]);
    } else if (grid[y + 1][x + 1] === '.') {
      return getNewSandCoord([x + 1, y + 1]);
    } else {
      return [x, y];
    }
  }
  if (grid[y + 1][x] === '.') {
    return getNewSandCoord([x, y + 1]);
  }
}


// ----
const startingSandPoz = [500, 0];

// Part 1
(() => {
  setupGrid();
  let nbInTheAbyss = 0;
  while (nbInTheAbyss === 0) {
    const start = [...startingSandPoz];
    const newSandCoord = getNewSandCoord(start);
    if (newSandCoord !== -1) {
      grid[newSandCoord[1]][newSandCoord[0]] = 'o';
    } else {
      nbInTheAbyss++;
    }
  }
  // printGrid();
  let sum = 0;
  grid.forEach(line => line.forEach(c => c === 'o' ? sum++ : 0));
  console.log(sum); // 1513
})();

// Part 2
(() => {
  setupGrid();
  grid.push(new Array(grid[0].length).fill(null).map(() => '.'));
  grid.push(new Array(grid[0].length).fill(null).map(() => '#'));

  while (grid[startingSandPoz[1]][startingSandPoz[0]] !== 'o') {
    const start = [...startingSandPoz];
    const newSandCoord = getNewSandCoord(start);
    if (newSandCoord !== -1) {
      grid[newSandCoord[1]][newSandCoord[0]] = 'o';
    }
  }
  // printGrid();
  let sum = 0;
  grid.forEach(line => line.forEach(c => c === 'o' ? sum++ : 0));
  console.log(sum); // 22646
})();
