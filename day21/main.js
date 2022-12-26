let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');
let map = new Map();

parsed.forEach((line) => {
  const [name, val] = line.split(':').map((el) => el.trim());
  let node = {name};
  if (isNaN(parseInt(val))) {
    const [a, op, b] = val.split(' ');
    node = {...node, a, b, op};
  } else {
    node.val = parseInt(val);
  }
  map.set(name, node)
})

let cacheDfs;
function dfs(nodeName, valueOfHuman = null) {
  const node = map.get(nodeName);

  if (cacheDfs.has(nodeName)) {
    return cacheDfs.get(nodeName);
  }
  if (node.val !== undefined) {
    if (valueOfHuman !== null && node.name === 'humn') { // For part2
      node.val = valueOfHuman;
    }
    cacheDfs.set(node.name, String(node.val));
    return String(node.val);
  }

  const a = dfs(node.a, valueOfHuman);
  const b = dfs(node.b, valueOfHuman);

  const ans = `(${a}${node.op}${b})`;
  cacheDfs.set(node.name, ans);
  return ans;
}

function part1() {
  cacheDfs = new Map();
  console.log({part1: eval(dfs('root'))});
}
part1(); // 10037517593724

function part2() {
  let monkey1 = map.get('root').a;
  let monkey2 = map.get('root').b;

  let a;
  let b;
  function simplifyIfNoXAndAssignValues(el) {
    if (el.includes('X')) {
      a = el;
      return;
    }
    el = eval(el);
    b = el;
  }
  cacheDfs = new Map();
  simplifyIfNoXAndAssignValues(dfs(monkey1, 'X'));
  simplifyIfNoXAndAssignValues(dfs(monkey2, 'X'));

  console.log(a , '=', b);
  console.log({
    part2: 'copy paste this 👆 in https://www.mathpapa.com/equation-solver/ or use any equation solving lib.'
  });
}
part2(); // 3272260914328