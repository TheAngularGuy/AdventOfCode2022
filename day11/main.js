let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');

function createMonkey(index) {
  return {
    index,
    items: [],
    operation: null,
    testFn: null,
    ifTrueNextMonkey: null,
    ifFalseNextMonkey: null,
    inspectedItems: 0,
    divisibleBy: 1,
  }
}

let monkeys;
function setMonkeys() {
  monkeys = [];
  let currentMonkey = null;
  parsed.forEach((line, index) => {
    if (line.startsWith('Monkey')) {
      const index = +line.split(' ')[1].replace(':', '');
      currentMonkey = createMonkey(index)
    }
    if (line.startsWith('  Starting items')) {
      const items = line.split(':')[1].split(',').map(el => Number(el.trim()));
      currentMonkey.items = items;
    }
    if (line.startsWith('  Operation')) {
      let num = line.split(' ').reverse()[0];
      if (line.startsWith('  Operation: new = old +')) {
        currentMonkey.operation = (nb) => {
          let operand;
          if (num === 'old') {
            operand = nb;
          } else {
            operand = +num;
          }
          return nb + operand;
        };
      } else if (line.startsWith('  Operation: new = old *')) {
        currentMonkey.operation = (nb) => {
          let operand;
          if (num === 'old') {
            operand = nb;
          } else {
            operand = +num;
          }
          return nb * operand;
        };
      }
    }
    if (line.startsWith('  Test')) {
      const num = +line.split(' ').reverse()[0];
      currentMonkey.divisibleBy = num;
      currentMonkey.testFn = (nb) => (nb % num) === 0;
      currentMonkey.ifTrueNextMonkey = +parsed[index + 1].split(' ').reverse()[0];
      currentMonkey.ifFalseNextMonkey = +parsed[index + 2].split(' ').reverse()[0];

      monkeys.push(currentMonkey);
      currentMonkey = null;
    }
  });
}


function compute(maxRounds, modePart1) {
  let sharedDivider = monkeys.reduce((acc, m) => acc * m.divisibleBy, 1);
  for (let round = 0; round < maxRounds; round++) {
    monkeys.forEach((monkey, index) => {
      while (monkey.items.length) {
        const itemToInspect = +monkey.items.shift();
        let worryLevel = monkey.operation(itemToInspect);
        if (modePart1) { // part 1
          worryLevel = Math.floor(worryLevel / 3);
        } else { // part 2
          worryLevel = worryLevel % sharedDivider;
        }
        const bool = monkey.testFn(worryLevel);
        if (bool) {
          monkeys[monkey.ifTrueNextMonkey].items.push(worryLevel);
        } else {
          monkeys[monkey.ifFalseNextMonkey].items.push(worryLevel);
        }
        monkey.inspectedItems += 1;
      }
    });
  }
  const inspectedItemsList = [];
  monkeys.forEach((m) => {
    inspectedItemsList.push(m.inspectedItems);
    console.log(`Monkey ${m.index} inspected items: `, m.inspectedItems);
  });
  inspectedItemsList.sort((a, b) => b - a);
  console.log(inspectedItemsList[0] * inspectedItemsList[1]);
}

// part 1
setMonkeys();
compute(20, true);

// part 2
setMonkeys();
compute(10000, false);
