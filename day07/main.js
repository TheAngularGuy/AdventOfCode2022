let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

function createNode(name, parent) {
  return {
    name,
    parent,
    children: [],
    files: [],
    size: 0,
  }
}

let rootNode = null;
let currentNode = null;

parsed.forEach((line, index) => {
  if (line.substring(0, 4) === '$ cd') {
    const dirName = line.split(' ')[2];
    if (dirName === '..') {
      currentNode = currentNode.parent;
      return;
    }
    const newNode = createNode(dirName, currentNode);
    if (currentNode) {
      currentNode.children.push(newNode);
    }
    currentNode = newNode;

    if (!rootNode) {
      rootNode = currentNode;
    }
  } else if (Number.isInteger(+line[0])) {
    const [fileSize, fileName] = line.split(' ');
    currentNode.files.push({fileSize, fileName});
  }
});


const directorySizes = [];
(function getNodeSize(node) {
  node.size = node.files.reduce((acc, file) => acc + Number(file.fileSize), 0);
  if (!!node.children.length) {
    let cumulatedChildrenSizes = 0;
    node.children.forEach((child) => cumulatedChildrenSizes += getNodeSize(child));
    node.size += cumulatedChildrenSizes;
  }
  directorySizes.push(node.size);
  return node.size;
})(rootNode);


// Bonus
function prettyPrint(node, depth = 0) {
  if (!node) {
    return;
  }
  console.log(new Array(depth).fill('  ').join('') + ' 📂 ' + node.name + ` (${node.size})`)
  node.files.forEach((file) => {
    console.log(new Array(depth).fill('  ').join('') + ' |__ ' + `${file.fileName} (${file.fileSize})`)
  })
  for (const nodeElement of node.children) {
    prettyPrint(nodeElement, depth + 1);
  }
}

prettyPrint(rootNode);


// Part 1
console.log(directorySizes.reduce((acc, size) => {
  if (size <= 100000) {
    return acc + size;
  }
  return acc;
}, 0));

// Part 2
const totalSpace = 70000000;
const updateSpace = 30000000;
const usedSpace = rootNode.size;
const freeSpace = totalSpace - usedSpace;
const neededSpace = updateSpace - freeSpace;
directorySizes.sort((a, b) => a - b);
for (const size of directorySizes) {
  if (size >= neededSpace) {
    console.log(size);
    break;
  }
}