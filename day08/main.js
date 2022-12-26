let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

const grid = input.split('\n').map((line) => line.trim().split(''));
const colMax = grid[0].length;
const rowMax = grid.length;

// Part 1
let nbVisibleTrees = colMax * 2 + (rowMax - 2) * 2;
for (let i = 1; i < rowMax - 1; i++) {
  for (let j = 1; j < colMax - 1; j++) {
    // left
    let subArray = [];
    for (let k = 0; k < j; k++) {
      subArray.push(grid[i][k]);
    }
    if (grid[i][j] > Math.max(...subArray)) {
      nbVisibleTrees += 1;
      continue;
    }
    // right
    subArray = [];
    for (let k = j + 1; k < colMax; k++) {
      subArray.push(grid[i][k]);
    }
    if (grid[i][j] > Math.max(...subArray)) {
      nbVisibleTrees += 1;
      continue;
    }
    // top
    subArray = [];
    for (let k = 0; k < i; k++) {
      subArray.push(grid[k][j]);
    }
    if (grid[i][j] > Math.max(...subArray)) {
      nbVisibleTrees += 1;
      continue;
    }
    // bottom
    subArray = [];
    for (let k = i + 1; k < rowMax; k++) {
      subArray.push(grid[k][j]);
    }
    if (grid[i][j] > Math.max(...subArray)) {
      nbVisibleTrees += 1;
      continue;
    }
  }
}
console.log(nbVisibleTrees);


// Part 2
let bestScore = 0;
for (let i = 0; i < rowMax; i++) {
  for (let j = 0; j < colMax; j++) {
    const currentTree = [0, 0, 0, 0];
    // top
    for (let k = i - 1; k >= 0; k--) {
      currentTree[0] += 1;
      if (grid[k][j] >= grid[i][j]) {
        break;
      }
    }
    // left
    for (let k = j - 1; k >= 0; k--) {
      currentTree[1] += 1;
      if (grid[i][k] >= grid[i][j]) {
        break;
      }
    }
    // bottom
    for (let k = i + 1; k < rowMax; k++) {
      currentTree[2] += 1;
      if (grid[k][j] >= grid[i][j]) {
        break;
      }
    }
    // right
    for (let k = j + 1; k < colMax; k++) {
      currentTree[3] += 1;
      if (grid[i][k] >= grid[i][j]) {
        break;
      }
    }

    const currentScore = currentTree.reduce((acc, nb) => acc * nb, 1);
    if (currentScore > bestScore) {
      bestScore = currentScore;
    }
  }
}
console.log(bestScore);
