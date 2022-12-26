let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

let playerPoz = {x: 1, y: 0};
let grid = []; // { wall: boolean; up,down,left,right: boolean }
parsed.forEach((line, y) => {
  const row = [];
  line.split('').forEach((c, x) => {
    if (c === '#') {
      row.push({wall: true});
    } else if (c === '>') {
      row.push({right: true});
    } else if (c === '<') {
      row.push({left: true});
    } else if (c === '^') {
      row.push({up: true});
    } else if (c === 'v') {
      row.push({down: true});
    } else {
      row.push({});
    }
  });
  grid.push(row);
});

function printGrid(grid) {
  let rows = '';
  grid.forEach((row, y) => {
    let line = '';
    row.forEach((point, x) => {
      if (x === playerPoz.x && y === playerPoz.y) {
        return line += 'E';
      }
      if (point.wall === true) {
        return line += '#';
      }
      const nb = Object.keys(point).length
      if (nb > 1) {
        return line += `${nb}`;
      } else if (point.up === true) {
        return line += '^';
      } else if (point.down === true) {
        return line += 'v';
      } else if (point.left === true) {
        return line += '<';
      } else if (point.right === true) {
        return line += '>';
      }
      line += '.';
    });
    rows += '\n';
    rows += line;
  });
  console.log(rows);
}

function getNextGrid(grid) {
  let newGrid = new Array(grid.length).fill(null).map(
    () => new Array(grid[0].length).fill(null).map(() => ({}))
  );
  grid.forEach((row, y) => {
    row.forEach((point, x) => {
      if (point.wall === true) {
        newGrid[y][x].wall = true;
      }
      if (point.up === true) {
        const nextPozY = (y - 1) === 0 ? grid.length - 2 : y - 1;
        newGrid[nextPozY][x].up = true;
      }
      if (point.down === true) {
        const nextPozY = (y + 1) === grid.length - 1 ? 1 : y + 1;
        newGrid[nextPozY][x].down = true;
      }
      if (point.left === true) {
        const nextPozX = (x - 1) === 0 ? grid[0].length - 2 : x - 1;
        newGrid[y][nextPozX].left = true;
      }
      if (point.right === true) {
        const nextPozX = (x + 1) === grid[0].length - 1 ? 1 : x + 1;
        newGrid[y][nextPozX].right = true;
      }
    });
  });
  return newGrid;
}

function hasWindOrBlocked(x, y, grid) {
  return (y < 0) || (y > grid.length - 1) ||
    grid[y][x].wall === true ||
    grid[y][x].up === true ||
    grid[y][x].down === true ||
    grid[y][x].left === true ||
    grid[y][x].right === true;
}

function lcm(a, b) {
  for (let i = 1; i < a * b; i++) {
    if (i % a === 0 && i % b === 0) {
      return i;
    }
  }
}

(function () {
  const nbGrids = lcm(grid.length - 2, grid[0].length - 2);
  const grids = new Map();

  function bfs(initialState = {x: playerPoz.x, y: playerPoz.y, gridIndex: 1, depth: 0}, reverseMode = false) {
    const queue = [initialState];
    const visited = new Set();

    const allAns = [];

    while (queue.length > 0) {
      const currentState = queue.shift();
      const gridIndex = currentState.gridIndex;
      const x = currentState.x;
      const y = currentState.y;

      const key = `${x},${y},${gridIndex}`
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);

      const currentGrid = grids.get(gridIndex);
      const nextGridIndex = (gridIndex + 1) === grids.size ? 0 : gridIndex + 1;
      const nextDepth = currentState.depth + 1;

      if (reverseMode && x === 1 && y === 0) {
        allAns.push(currentState);
      }
      if (!reverseMode && x === currentGrid[0].length - 2 && y === currentGrid.length - 1) {
        allAns.push(currentState);
      }

      // down
      if (!hasWindOrBlocked(x, y + 1, currentGrid)) {
        queue[reverseMode ? 'push' : 'unshift']({
          y: y + 1,
          x: x,
          gridIndex: nextGridIndex,
          depth: nextDepth,
        });
      }
      // right
      if (!hasWindOrBlocked(x + 1, y, currentGrid)) {
        queue[reverseMode ? 'push' : 'unshift']({
          y: y,
          x: x + 1,
          gridIndex: nextGridIndex,
          depth: nextDepth,
        });
      }

      // no move
      if (!hasWindOrBlocked(x, y, currentGrid)) {
        queue.push({
          y: y,
          x: x,
          gridIndex: nextGridIndex,
          depth: nextDepth,
        });
      }

      // left
      if (!hasWindOrBlocked(x - 1, y, currentGrid)) {
        queue[reverseMode ? 'unshift' : 'push']({
          y: y,
          x: x - 1,
          gridIndex: nextGridIndex,
          depth: nextDepth,
        });
      }
      // up
      if (!hasWindOrBlocked(x, y - 1, currentGrid)) {
        queue[reverseMode ? 'unshift' : 'push']({
          y: y - 1,
          x: x,
          gridIndex: nextGridIndex,
          depth: nextDepth,
        });
      }
    }
    return allAns.sort((a, b) => a.depth - b.depth)[0]
  }

  let tmpGrid = grid;
  for (let i = 0; i < nbGrids; i++) {
    grids.set(i, tmpGrid);
    tmpGrid = getNextGrid(tmpGrid);
  }

  (function part1() {
    const ans = bfs();
    console.log({part1: ans.depth});
  })(); // 274

  (function part2() {
    const fromStartToEnd = bfs();
    const fromStartToEndToStart = bfs(fromStartToEnd, true);
    const fromStartToEndToStartToEnd = bfs(fromStartToEndToStart);
    console.log({part2: fromStartToEndToStartToEnd.depth});
  })(); // 839

})();
