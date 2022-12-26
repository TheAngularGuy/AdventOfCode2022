let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

// Part 1
let sum = 0;
parsed.forEach((line) => {
  const [a, b] = line.split(',');
  const minA = Math.min(...a.split('-').map(n => +n));
  const maxA = Math.max(...a.split('-').map(n => +n));
  const minB = Math.min(...b.split('-').map(n => +n));
  const maxB = Math.max(...b.split('-').map(n => +n));

  if (minA <= minB && maxA >= maxB) {
    // a contain b
    sum += 1;
  } else if (minB <= minA && maxB >= maxA) {
    // b contain a
    sum += 1;
  }
})
console.log(sum);


// Part 2
sum = 0;
parsed.forEach((line) => {
  const [a, b] = line.split(',');
  const minA = Math.min(...a.split('-').map(n => +n));
  const maxA = Math.max(...a.split('-').map(n => +n));
  const minB = Math.min(...b.split('-').map(n => +n));
  const maxB = Math.max(...b.split('-').map(n => +n));

  if (minA <= minB && maxA >= minB) {
    sum += 1;
  } else if (minB <= minA && maxB >= minA) {
    sum += 1;
  }
})
console.log(sum);