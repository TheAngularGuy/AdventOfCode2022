let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

function letterToCode(letter) {
  const code = letter.charCodeAt(0);
  if (code >= 97) {
    return code - 97 + 1;
  }
  return code - 65 + 27;
}

// Part 1
let sum = 0;
parsed.forEach((line) => {
  const first = line.substring(0, line.length / 2);
  const second = line.substring(line.length / 2);

  let foundDouble = []
  first.split('').forEach((letter) => {
    if (second.includes(letter)) {
      foundDouble.unshift(letter);
    }
  });
  foundDouble = [...new Set(foundDouble)];
  foundDouble.forEach((letter) => {
    sum += letterToCode(letter);
  });
});
console.log(sum);

// Part 1
sum = 0;
const groups = [];
let tmpGroup = [];
parsed.forEach((line, index) => {
  tmpGroup.push(line);
  if ((index + 1) % 3 === 0) {
    groups.push([...tmpGroup]);
    tmpGroup = [];
  }
});
groups.forEach((group) => {
  const first = group[0];
  const second = group[1];
  const third = group[2];

  let foundDouble = [];
  first.split('').forEach((letter) => {
    if (second.includes(letter) && third.includes(letter)) {
      foundDouble.unshift(letter);
    }
  });
  foundDouble = [...new Set(foundDouble)];
  foundDouble.forEach((letter) => {
    sum += letterToCode(letter);
  });
});
console.log(sum);
