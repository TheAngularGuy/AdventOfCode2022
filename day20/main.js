let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');
const len = parsed.length;

let root;

function buildLinkedList(multiplier = 1) {
  root = {
    isStart: true,
    value: null,
    prev: null,
    next: null,
  };

  let prev = null;
  parsed.forEach((v, index) => {
    const num = parseInt(v) * multiplier;
    const current = index === 0 ? root : {};
    if (prev) {
      prev.next = current;
    }
    current.value = num;
    current.prev = prev;
    if (index === parsed.length - 1) {
      current.next = root;
      root.prev = current;
    }
    prev = current;
  });
}

function printLinkedList() {
  let list = [];
  let current = root;

  let i = 0;
  while (true) {
    list.push(current.value);
    current = current.next;
    if (current === root && i !== 0) {
      break;
    }
    i++;
  }
  console.log(list.join(', '))
}


function moveNodeToRight(node) {
  const prev = node.prev;
  const next = node.next;
  prev.next = next;
  next.prev = prev;
  if (node === root) {
    root = next;
  }
  const a = next;
  const b = next.next;
  b.prev = node;
  node.next = b;
  a.next = node;
  node.prev = a;
}

function moveNodeToLeft(node) {
  const prev = node.prev;
  const next = node.next;
  prev.next = next;
  next.prev = prev;
  if (node === root) {
    root = next;
  }
  const a = prev.prev;
  const b = prev;
  b.prev = node;
  node.next = b;
  a.next = node;
  node.prev = a;
}

function moveNode(current) {
  let num = current.value % (len - 1); // because we remove the item from the list before moving it
  while (num !== 0) {
    if (num > 0) {
      moveNodeToRight(current);
      num--;
    } else {
      moveNodeToLeft(current);
      num++;
    }
  }
}


function solve(multiplier = 1, numberOfMix = 1) {
  buildLinkedList(multiplier);

  const listOfNode = [];
  let current = root;
  for (let i = 0; i < len; i++) {
    listOfNode.push(current);
    current = current.next;
  }

  for (let i = 0; i < numberOfMix; i++) {
    for (const node of listOfNode) {
      moveNode(node);
    }
  }

  let offset = 0;
  current = root;
  for (let i = 0; i < len; i++) {
    if (current.value === 0) {
      offset = i;
      break;
    }
    current = current.next;
  }

  const a = (1000 + offset) % len;
  const b = (2000 + offset) % len;
  const c = (3000 + offset) % len;
  let sum = 0;

  current = root;
  for (let i = 0; i < len; i++) {
    if (i === a || i === b || i === c) {
      sum += current.value;
    }
    current = current.next;
  }
  console.log(sum);
}

function part1() {
  solve();
}
part1(); // 5962


function part2() {
  solve(811589153, 10);
}
part2(); // 9862431387256

