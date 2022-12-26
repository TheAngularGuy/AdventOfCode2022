let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n\n');
let sums = parsed.map(list => list.split('\n').reduce((acc, num) => acc + Number(num), 0))

let sortedSums = sums.sort((a, b) => b - a);

// part 1
console.log(sortedSums[0]);

// part 2
console.log(sortedSums[0] + sortedSums[1] + sortedSums[2]);
