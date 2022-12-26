let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

const stack = [];
parsed.forEach((line) => {
  stack.push(null);

  if (line.startsWith('addx')) {
    const nb = line.split(' ')[1];
    stack.push(+nb);
  }
});

let crt = [];
let sprite = '###.....................................'.split('');
let sum = 0;
let xRegistryValue = 1;
stack.forEach((nb, index) => {
  const cycle = index + 1;

  // Part 1
  if ((cycle - 20) % 40 === 0) {
    sum += xRegistryValue * cycle;
    console.log(`Cycle ${String(cycle).padStart(4, ' ')} start. X registry = ${xRegistryValue}.  
                  Signal     = ${xRegistryValue * cycle}.  
                  Sum        = ${sum}.`);
    console.log(`=======================================`);
  }

  if (nb !== null) {
    xRegistryValue += nb;
  }

  // Part 2
  const char = sprite[index % 40] === '#' ? '✺' : ' ';
  crt.push(char);
  sprite = new Array(40).fill(null).map(() => '.');
  sprite[xRegistryValue] = '#';
  sprite[xRegistryValue - 1] = '#';
  sprite[xRegistryValue + 1] = '#';
});


// Part 2
(function printCrt() {
  let line = ''
  crt.forEach((c, index) => {
    line += c;
    if ((index + 1) % 40 === 0) {
      line += '\n';
    }
  });
  console.log(line);
})();