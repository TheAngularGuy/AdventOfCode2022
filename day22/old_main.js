let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let [lines, instructions] = input.split('\n\n');
let grid = lines.split('\n').map(el => el.split(''));
instructions = instructions
  .replaceAll('R', ' R ')
  .replaceAll('L', ' L ')
  .split(' ');


let rows = new Map();
let columns = new Map();
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === '.' || grid[i][j] === '#') {
      if (!rows.has(i)) {
        rows.set(i, {
          min: +Infinity,
          max: -Infinity,
          blocked: [],
        });
      }
      rows.get(i).min = Math.min(rows.get(i).min, j);
      rows.get(i).max = Math.max(rows.get(i).max, j);
      grid[i][j] === '#' && rows.get(i).blocked.push(j);

      if (!columns.has(j)) {
        columns.set(j, {
          min: +Infinity,
          max: -Infinity,
          blocked: [],
        });
      }
      columns.get(j).min = Math.min(columns.get(j).min, i);
      columns.get(j).max = Math.max(columns.get(j).max, i);
      grid[i][j] === '#' && columns.get(j).blocked.push(i);
    }
  }
}

//                   x             ,               y
let currentPoint = [rows.get(0).min, columns.get(rows.get(0).min).min];
let currentDir = 0;

function moveRight(nbMoves) {
  nbMoves = +nbMoves;
  const currentColIndex = currentPoint[0];
  const currentRowIndex = currentPoint[1];
  const currentRow = rows.get(currentRowIndex);
  const nbTiles = (currentRow.max + 1 - currentRow.min);

  let cursor = currentColIndex;
  for (let i = 0; i < nbMoves; i++) {
    const next = cursor + 1 === currentRow.max + 1 ? currentRow.min : cursor + 1;
    if (currentRow.blocked.includes(next)) {
      break
    }
    cursor = next;
  }
  currentPoint[0] = cursor;
}
function moveLeft(nbMoves) {
  nbMoves = +nbMoves;
  const currentColIndex = currentPoint[0];
  const currentRowIndex = currentPoint[1];
  const currentRow = rows.get(currentRowIndex);

  let cursor = currentColIndex;
  for (let i = 0; i < nbMoves; i++) {
    const next = cursor - 1 === currentRow.min - 1 ? currentRow.max : cursor - 1;
    if (currentRow.blocked.includes(next)) {
      break
    }
    cursor = next
  }
  currentPoint[0] = cursor;
}
function moveDown(nbMoves) {
  nbMoves = +nbMoves;
  const currentColIndex = currentPoint[0];
  const currentRowIndex = currentPoint[1];
  const currentCol = columns.get(currentColIndex);

  let cursor = currentRowIndex;
  for (let i = 0; i < nbMoves; i++) {
    const next = cursor + 1 === currentCol.max + 1 ? currentCol.min : cursor + 1;
    if (currentCol.blocked.includes(next)) {
      break
    }
    cursor = next
  }
  currentPoint[1] = cursor;
}
function moveUp(nbMoves) {
  nbMoves = +nbMoves;
  const currentColIndex = currentPoint[0];
  const currentRowIndex = currentPoint[1];
  const currentCol = columns.get(currentColIndex);

  let cursor = currentRowIndex;
  for (let i = 0; i < nbMoves; i++) {
    const next = cursor - 1 === currentCol.min - 1 ? currentCol.max : cursor - 1;
    if (currentCol.blocked.includes(next)) {
      break
    }
    cursor = next
  }
  currentPoint[1] = cursor;
}
function getNextDir(instruction) {
  let cur = currentDir + (instruction === 'R' ? 1 : -1);
  cur = cur % 4;
  cur = cur === -1 ? 3 : cur;
  return cur;
}
const moveFunctions = [moveRight, moveDown, moveLeft, moveUp];


function part1() {
  for (const instruction of instructions) {
    if (!isNaN(parseInt(instruction))) {
      const nbMoves = parseInt(instruction);
      moveFunctions[currentDir](nbMoves);
    } else {
      currentDir = getNextDir(instruction);
    }
  }
  console.log({currentPoint, part1: (currentPoint[1] + 1) * 1000 + (currentPoint[0] + 1) * 4 + currentDir});
}
part1(); //80392
