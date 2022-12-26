let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n')[0].split('');

function getFirstOccurences(nbOccurence) {
  for (let i = 0; i < parsed.length - nbOccurence; i++) {
    const tmpArray = [];
    for (let j = 0; j < nbOccurence; j++) {
      tmpArray.push(parsed[i + j]);
    }
    const set = [...new Set(tmpArray)];
    if (set.length === nbOccurence) {
      return (i + nbOccurence);
    }
  }
}

// Part 1
console.log(getFirstOccurences(4));

// Part 2
console.log(getFirstOccurences(14));

