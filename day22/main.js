let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let [lines, instructions] = input.split('\n\n');

let map = [];
let cols = 0;
let rows = 0;
let size = 0;
let pos = {row: 0, col: 0, dir: '>'};

const inc = {'>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1]};
const dirValue = {'>': 0, 'v': 1, '<': 2, '^': 3};
const rotate = {
  L: {'>': '^', 'v': '>', '<': 'v', '^': '<'},
  R: {'>': 'v', 'v': '<', '<': '^', '^': '>'}
};

lines.split("\n").map((line, row) => {
  cols = Math.max(cols, line.length);
  let tmp = Array(cols);
  line.split('').forEach((v, col) => {
    if (['.', '#'].includes(v)) tmp[col] = v;
  })
  map.push(tmp);
});
rows = map.length;

let forwards = instructions.match(/\d+/g).map(Number);
let rotations = instructions.match(/[RL]/g);
let sideMap = genSideMap();


function sideVal (pos) {
  return sideMap[Math.floor(pos.row / size)][Math.floor(pos.col / size)];
}

function nextPosP2(p) {
  let i = inc[p.dir];
  let pos = {...p};

  let sideFrom = sideVal(p);

  pos.row += i[1];
  pos.col += i[0];

  // check bounds
  let sideTo = (pos.row < 0 || pos.col < 0 || pos.row >= rows || pos.col >= cols) ?
    undefined :
    sideVal(pos);

  // no transition
  if (sideTo === sideFrom) {
    return pos;
  }

  // naturally supported transitions
  if (sideTo) {
    return pos;
  }

  if (sideFrom === 1 && pos.dir === '^') {
    // 1 to 6
    pos.dir = '>';
    pos.row = 150 + p.col - 50;
    pos.col = 0;
  } else if (sideFrom === 1 && pos.dir === '<') {
    // 1 to 4
    pos.dir = '>';
    pos.row = 100 + 49 - p.row;
    pos.col = 0;
  }

  if (sideFrom === 2 && pos.dir === '^') {
    pos.col = p.col - 100;
    pos.row = 199;
  } else if (sideFrom === 2 && pos.dir === '>') {
    // 2 to 5
    pos.dir = '<';
    pos.col = 99;
    pos.row = 100 + 49 - p.row;
  } else if (sideFrom === 2 && pos.dir === 'v') {
    pos.dir = '<';
    pos.col = 99;
    pos.row = p.col - 100 + 50;
  }

  if (sideFrom === 3 && pos.dir === '>') {
    // 3 -> 2
    pos.dir = '^'
    pos.col = p.row - 50 + 100;
    pos.row = 49;
  } else if (sideFrom === 3 && pos.dir === '<') {
    // 3 -> 4
    pos.dir = 'v';
    pos.col = p.row - 50;
    pos.row = 100;
  }

  if (sideFrom === 4 && pos.dir === '<') {
    // 4 -> 1
    pos.dir = '>';
    pos.col = 50;
    pos.row = 149 - p.row;
  } else if (sideFrom === 4 && pos.dir === '^') {
    // 4 -> 3
    pos.dir = '>';
    pos.col = 50;
    pos.row = p.col + 50;
  }

  if (sideFrom === 5 && pos.dir === '>') {
    // 5 -> 2
    pos.dir = '<';
    pos.col = 149;
    pos.row = 149 - p.row;
  } else if (sideFrom === 5 && pos.dir === 'v') {
    // 5 -> 6
    pos.dir = '<';
    pos.col = 49;
    pos.row = p.col - 50 + 150;
  }

  if (sideFrom === 6 && pos.dir === 'v') {
    // 6 to 2
    pos.col = p.col + 100;
    pos.row = 0;
  } else if (sideFrom === 6 && pos.dir === '>') {
    // 6 -> 5
    pos.dir = '^';
    pos.col = p.row - 150 + 50;
    pos.row = 149;
  } else if (sideFrom === 6 && pos.dir === '<') {
    // 6 -> 1
    pos.dir = 'v';
    pos.col = p.row - 150 + 50;
    pos.row = 0;
  }

  return pos;
}

function nextPosP1(p) {
  let i = inc[p.dir];
  let pos = {...p};

  function step() {
    pos.row += i[1];
    pos.col += i[0];

    if (pos.col >= cols) {
      pos.col = 0;
    }
    if (pos.row >= rows) {
      pos.row = 0;
    }
    if (pos.col < 0) {
      pos.col = cols - 1;
    }
    if (pos.row < 0) {
      pos.row = rows - 1;
    }
  }

  step();

  while (map[pos.row][pos.col] === undefined) {
    step();
  }
  return pos;
}

function move(steps, nextPos) {
  while (map[nextPos(pos).row][nextPos(pos).col] === '.' && steps) {
    steps--;
    pos = nextPos(pos)
  }
}

function genSideMap() {
  let div = rows > cols ? [3, 4] : [4, 3]; // cols, rows
  size = cols / div[0];
  let miniMap = Array.from({length: div[1]}, () => Array(div[0])), side = 1;
  for (let row = 0; row < div[1]; row++) {
    for (let col = 0; col < div[0]; col++) {
      if (map[row * size][col * size] !== undefined) {
        miniMap[row][col] = side++;
      }
    }
  }
  return miniMap;
}

function solve(nextPosFnc) {
  pos = {dir: '>', col: map[0].indexOf('.'), row: 0}
  for (let i = 0; i <= forwards.length + rotations.length - 1; i++) {
    if (i % 2 === 0) {
      move(forwards[i / 2], nextPosFnc);
    }
    if (i % 2 === 1) {
      pos.dir = rotate[rotations[(i - 1) / 2]][pos.dir];
    }
  }
  return (pos.row + 1) * 1000 + (pos.col + 1) * 4 + dirValue[pos.dir];
}


(function part1() {
  const ans = solve(nextPosP1);
  console.log({part1: ans}); // 80392
})();

(function part2() {
  const ans = solve(nextPosP2);
  console.log({part2: ans}); // 19534
})();
