let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

// Part 1
let score = 0;
input.split('\n').forEach((line) => {
  const [opponent, player] = line.split(' ');

  if (opponent === 'A' && player === 'X') {
    score += 1;
    score += 3;
  } else if (opponent === 'A' && player === 'Y') {
    score += 2;
    score += 6;
  } else if (opponent === 'A' && player === 'Z') {
    score += 3;
    score += 0;
  } else if (opponent === 'B' && player === 'X') {
    score += 1;
    score += 0;
  } else if (opponent === 'B' && player === 'Y') {
    score += 2;
    score += 3;
  } else if (opponent === 'B' && player === 'Z') {
    score += 3;
    score += 6;
  } else if (opponent === 'C' && player === 'X') {
    score += 1;
    score += 6;
  } else if (opponent === 'C' && player === 'Y') {
    score += 2;
    score += 0;
  } else if (opponent === 'C' && player === 'Z') {
    score += 3;
    score += 3;
  }
});
console.log(score);

// Part 2
score = 0;
input.split('\n').forEach((line) => {
  const [opponent, player] = line.split(' ');

  if (opponent === 'A' && player === 'Z') {
    score += 2;
    score += 6;
  } else if (opponent === 'A' && player === 'Y') {
    score += 1;
    score += 3;
  } else if (opponent === 'A' && player === 'X') {
    score += 3;
    score += 0;
  } else if (opponent === 'B' && player === 'Z') {
    score += 3;
    score += 6;
  } else if (opponent === 'B' && player === 'Y') {
    score += 2;
    score += 3;
  } else if (opponent === 'B' && player === 'X') {
    score += 1;
    score += 0;
  } else if (opponent === 'C' && player === 'Z') {
    score += 1;
    score += 6;
  } else if (opponent === 'C' && player === 'Y') {
    score += 3;
    score += 3;
  } else if (opponent === 'C' && player === 'X') {
    score += 2;
    score += 0;
  }
});
console.log(score);

