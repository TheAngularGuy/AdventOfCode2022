let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n');


function SNAFUToDecimal(numStr) {
  let sum = 0;
  for (let i = 0; i < numStr.length; i++) {
    const pow = numStr.length - 1 - i;
    const char = numStr[i];
    let nb = '=-012'.split('').findIndex(el => el === char) - 2;
    sum += nb * Math.pow(5, pow);
  }
  return sum;
}

function decimalToSNAFU(num) {
  let value = num;
  let ans = '';

  while (value) {
    let rem = value % 5;
    value = Math.floor(value / 5);

    if (rem < 3) {
      ans = rem + ans;
    } else {
      ans = ['', '', '', '=', '-'][rem] + ans; // look at the examples how 3 & 4 and 8 & 9 are formed
      value += 1;
    }
  }
  return ans;
}


(function part1() {
  const sum = parsed.reduce((acc, num) => {
    const ans = SNAFUToDecimal(num);
    return ans + acc;
  }, 0);
  console.log(sum);
  const ans = decimalToSNAFU(sum);
  console.log(ans);
})();
