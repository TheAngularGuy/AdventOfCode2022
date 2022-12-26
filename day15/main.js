let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

function newPoint(x, y, a, b) {
  return {
    x: +x,
    y: +y,
    beacon: {
      x: +a,
      y: +b,
    },
    distance: Math.abs(+x - +a) + Math.abs(+y - +b),
  }
}

const points = [];
let hashBeacon = new Map();
let hashSensor = new Map();
parsed.forEach((line) => {
  const [left, right] = line.split(':');
  const x = left.split('x=')[1].split(',')[0];
  const y = left.split('y=')[1];
  const a = right.split('x=')[1].split(',')[0];
  const b = right.split('y=')[1];
  const point = newPoint(x, y, a, b);
  points.push(point);
  hashBeacon.set(`${point.beacon.x},${point.beacon.y}`, true);
  hashSensor.set(`${point.x},${point.y}`, true);
});


const targetRow = points.length < 15 ? 10 : 2000000;

(function part1() {
  const hash = new Map();
  points.forEach((point) => {
    const distance = point.distance;

    const row = targetRow;
    for (let i = point.x - distance; i <= point.x + distance; i++) {
      const currentDistance = Math.abs(point.x - i) + Math.abs(point.y - row);
      if (currentDistance > distance) {
        continue;
      }
      const currentKey = `${i},${row}`;
      if (!hashBeacon.has(currentKey) && !hashSensor.has(currentKey)) {
        hash.set(currentKey, true)
      }

    }
  });
  console.log(hash?.size); // 5176944
})();

(function part2() {
  let potentialPoint;

  mainLoop:
  for (const point of points) {
    let x1;
    let x2;

    x1 = point.x;
    x2 = point.x;
    for (let i = point.y - point.distance - 1; i <= point.y; i++) {
      if (!!potentialPoint) {
        break mainLoop;
      }
      check(i, x1, x2);
      x1--;
      x2++;
    }
    x1 = point.x;
    x2 = point.x;
    for (let i = point.y + point.distance + 1; i > point.y; i--) {
      if (!!potentialPoint) {
        break mainLoop;
      }
      check(i, x1, x2);
      x1--;
      x2++;
    }

    function isSamePoint(a, b) {
      return a.x === b.x && a.y === b.y && a.distance === b.distance;
    }

    function check(i, x1, x2) {
      if (i < 0 || i > targetRow * 2) {
        return;
      }
      if (x1 >= 0) {
        const arr = points.filter((otherPoint) => {
          if (isSamePoint(otherPoint, point)) {
            return false;
          }
          const d = Math.abs(x1 - otherPoint.x) + Math.abs(i - otherPoint.y);
          return (d > otherPoint.distance)
        });
        if (arr.length === points.length - 1) {
          potentialPoint = [x1, i];
        }
      }
      if (x2 <= targetRow * 2 && x2 !== x1) {
        const arr = points.filter((otherPoint) => {
          if (isSamePoint(otherPoint, point)) {
            return false;
          }
          const d = Math.abs(x2 - otherPoint.x) + Math.abs(i - otherPoint.y);
          return (d > otherPoint.distance)
        });
        if (arr.length === points.length - 1) {
          potentialPoint = [x2, i];
        }
      }
    }

  } // mainLoop end
  console.log(potentialPoint?.[0] * 4000000 + potentialPoint?.[1]); // 13350458933732
})();
