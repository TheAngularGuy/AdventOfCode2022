let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

let grid; // string[][]
let rope; // string[]

const enablePrint = false;

function prettyPrint() {
  const stack = [];
  for (let i = 0; i < grid.length; i++) {
    const line = [];
    for (let j = 0; j < grid[0].length; j++) {
      line.push(grid[i][j] || '_')
      for (let k = rope.length - 1; k >= 0; k--) {
        if (rope[k].x === j && rope[k].y === i) {
          line[j] = k === 0 ? 'H' : k;
        }
      }
    }
    stack.push(line.join(','));
  }
  console.log(stack.join('\n'));
  console.log('------');
}

function areKnotsAdjacent(knot1, knot2) {
  return (Math.abs(knot1.x - knot2.x) <= 1) && (Math.abs(knot1.y - knot2.y) <= 1);
}

function moveRope(i = 0) {
  if (i === rope.length - 1) {
    grid[rope[i].y][rope[i].x] = '#';
    return;
  }
  if (areKnotsAdjacent(rope[i], rope[i + 1])) {
    return;
  }
  const deltaY = rope[i].y - rope[i + 1].y;
  const deltaX = rope[i].x - rope[i + 1].x;
  rope[i + 1].y += Math.sign(deltaY);
  rope[i + 1].x += Math.sign(deltaX);
  moveRope(i + 1);
}

function simRope() {
  parsed.forEach((line) => {
    let [dir, nbMoves] = line.split(' ');
    nbMoves = +nbMoves;

    for (let i = 0; i < nbMoves; i++) {
      switch (dir) {
        case 'L': {
          rope[0].x -= 1
          if (grid[rope[0].y]?.[rope[0].x] === undefined) {
            for (const knot of rope) {
              knot.x += 1;
            }
            grid.forEach(line => line.unshift(' '));
          }
          moveRope();
          break;
        }
        case 'U': {
          rope[0].y -= 1;
          if (grid[rope[0].y]?.[rope[0].x] === undefined) {
            for (const knot of rope) {
              knot.y += 1;
            }
            grid.unshift(new Array(grid[0].length).fill(null).map(() => ' '));
          }
          moveRope();
          break;
        }
        case 'R': {
          rope[0].x += 1;
          if (grid[rope[0].y]?.[rope[0].x] === undefined) {
            grid.forEach(line => line.push(' '));
          }
          moveRope();
          break;
        }
        case 'D': {
          rope[0].y += 1
          if (grid[rope[0].y]?.[rope[0].x] === undefined) {
            grid.push(new Array(grid[0].length).fill(null).map(() => ' '));
          }
          moveRope();
          break;
        }
      }
    }
    if (enablePrint) { // Bonus: print line by line (after the moves are done)
      console.log(dir, nbMoves, ':');
      prettyPrint(grid);
    }
  });
}

// Part 1
grid = [['s']];
rope = new Array(2).fill(null).map(() => ({x: 0, y: 0}));
simRope();
console.log(grid.reduce((sum, line) => sum + line.reduce((acc, el) => (el !== ' ' ? acc + 1 : acc), 0), 0));

// Part 2
grid = [['s']];
rope = new Array(10).fill(null).map(() => ({x: 0, y: 0}));
simRope();
console.log(grid.reduce((sum, line) => sum + line.reduce((acc, el) => (el !== ' ' ? acc + 1 : acc), 0), 0));
