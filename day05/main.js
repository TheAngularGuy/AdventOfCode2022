let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

/*
[D]                     [N] [F]
[H] [F]             [L] [J] [H]
[R] [H]             [F] [V] [G] [H]
[Z] [Q]         [Z] [W] [L] [J] [B]
[S] [W] [H]     [B] [H] [D] [C] [M]
[P] [R] [S] [G] [J] [J] [W] [Z] [V]
[W] [B] [V] [F] [G] [T] [T] [T] [P]
[Q] [V] [C] [H] [P] [Q] [Z] [D] [W]
 1   2   3   4   5   6   7   8   9
 */

// Part 1
let stacks = [
  'QWPSZRHD'.split(''),
  'VBRWQHF'.split(''),
  'CVSH'.split(''),
  'HFG'.split(''),
  'PGJBZ'.split(''),
  'QTJHWFL'.split(''),
  'ZTWDLVJN'.split(''),
  'DTZCJGHF'.split(''),
  'WPVMBH'.split(''),
];
parsed.forEach((line) => {
  const [, nbToMove, , from, , to] = line.split(' ');

  for (let i = 0; i < nbToMove; i++) {
    const crate = stacks[from - 1].pop();
    stacks[to - 1].push(crate);
  }
});
console.log(stacks.reduce((acc, stack) => acc + [...stack].pop(), ''));

// Part 2
stacks = stacks = [
  'QWPSZRHD'.split(''),
  'VBRWQHF'.split(''),
  'CVSH'.split(''),
  'HFG'.split(''),
  'PGJBZ'.split(''),
  'QTJHWFL'.split(''),
  'ZTWDLVJN'.split(''),
  'DTZCJGHF'.split(''),
  'WPVMBH'.split(''),
];
parsed.forEach((line) => {
  const [, nbToMove, , from, , to] = line.split(' ');

  const tempStack = [];
  for (let i = 0; i < nbToMove; i++) {
    const crate = stacks[from - 1].pop();
    tempStack.unshift(crate);
  }
  tempStack.forEach((crate) => {
    stacks[to - 1].push(crate);
  })
});
console.log(stacks.reduce((acc, stack) => acc + [...stack].pop(), ''));
