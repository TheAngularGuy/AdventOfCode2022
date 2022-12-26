let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');
parsed.push('');

let listOfPairs = [];
let tmpPair = [];
parsed.forEach((line, index) => {
  const el = eval(line);
  if (el === undefined) {
    listOfPairs.push(tmpPair);
    tmpPair = [];
  } else {
    tmpPair.push(el);
  }
});


function comparePairs(first, second) {
  let maxLen = Math.max(first.length, second.length);
  for (let i = 0; i < maxLen; i++) {
    const a = first[i];
    const b = second[i];

    if (a === undefined && b !== undefined) {
      // If the left list runs out of items first, the inputs are in the right order
      return -1;
    }
    if (a !== undefined && b === undefined) {
      // If the right list runs out of items first, the inputs are not in the right order
      return 1;
    }
    if (Number.isInteger(a) && Number.isInteger(b)) {
      if (a === b) {
        // The inputs are the same integer; continue checking the next part of the input
        continue;
      }
      // If the left integer is lower than the right integer, the inputs are in the right order
      // If the left integer is higher than the right integer, the inputs are not in the right order
      return a < b ? -1 : 1;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return comparePairs(a, b);
    }
    if (Number.isInteger(a) && Array.isArray(b)) {
      return comparePairs([a], b);
    }
    if (Number.isInteger(b) && Array.isArray(a)) {
      return comparePairs(a, [b]);
    }
  }
  return 0;
}


// Part 1
const orderedParsIndexes = [];
listOfPairs.forEach((pair, pairIndex) => {
  const [first, second] = pair;
  const order = comparePairs(first, second);
  if (order === -1 || order === 0) {
    orderedParsIndexes.push(pairIndex + 1);
  }
});
console.log(orderedParsIndexes, '=============> Part 1: ', orderedParsIndexes.reduce((acc, el) => acc + el, 0));


// Part 2
const startPacket = [[2]];
const endPacket = [[6]];
const packets = [startPacket, endPacket];
listOfPairs.forEach((pair) => {
  const [first, second] = pair;
  packets.push(first);
  packets.push(second);
});
packets.sort((a, b) => comparePairs(a, b));

let multipleA = 1;
let multipleB = 1;
packets.forEach((el, index) => {
  if (String(el) === String(startPacket)) {
    multipleA = (index + 1);
  }
  if (String(el) === String(endPacket)) {
    multipleB = (index + 1);
  }
});
console.log(multipleA, multipleB, '=======> Part 2: ', multipleB * multipleA);
