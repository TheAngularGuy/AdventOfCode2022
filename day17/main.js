let fs = require('fs');
let path = process.cwd();
let buffer = fs.readFileSync(path + "/input.txt");
let input = buffer.toString();

let parsed = input.split('\n')[0].trim().split('');

function* createGetNextWindGenerator() {
  let i = 0;
  while (true) {
    yield parsed[i++] === '<' ? -1 : 1;
    if (i === parsed.length) {
      i = 0;
    }
  }
}


const lineRock = [
  [2, 0], [3, 0], [4, 0], [5, 0]
];
const plusRock = [
          [3, 2],
  [2, 1], [3, 1], [4, 1],
          [3, 0],
];
const lRock = [
                  [4, 2],
                  [4, 1],
  [2, 0], [3, 0], [4, 0],
];
const iRock = [
  [2, 3],
  [2, 2],
  [2, 1],
  [2, 0],
];
const squareRock = [
  [2, 1], [3, 1],
  [2, 0], [3, 0],
];

function* createGetNextRockGenerator() {
  const rockShapes = [lineRock, plusRock, lRock, iRock, squareRock]
  let i = 0;
  while (true) {
    yield [...rockShapes[i++]]; // to prevent any mutation shenanigans
    if (i === rockShapes.length) {
      i = 0;
    }
  }
}


function getHeightAfterNbRocks(maxRounds) {
  const getNextWind = createGetNextWindGenerator();
  const getNextRock = createGetNextRockGenerator();

  const minX = 0;
  const maxX = 6;
  const minFlour = 0;

  const deltaInLevelChanges = [];
  const occupiedSpaces = new Map();

  let rockCounter = 0;
  let currentLevel = 0;

  while (rockCounter < maxRounds) {
    let currentRock = getNextRock.next().value;

    // elevate rock by currentLevel + 3;
    currentRock = currentRock.map(point => [point[0], point[1] + currentLevel + 3]);

    while (true) {
      // move rock by wind
      const windDelta = getNextWind.next().value;
      const simulatedMovedRockByWind = currentRock.map(point => [point[0] + windDelta, point[1]]);
      let isPossible = true;
      simulatedMovedRockByWind.forEach(point => {
        if (point[0] < minX || point[0] > maxX || occupiedSpaces.has(`${point[0]},${point[1]}`)) {
          isPossible = false;
        }
      });
      if (isPossible) {
        currentRock = simulatedMovedRockByWind;
      }

      // move rock down
      const simulatedMovedRockByGravity = currentRock.map(point => [point[0], point[1] - 1]);
      isPossible = true;
      simulatedMovedRockByGravity.forEach(point => {
        if (point[1] < minFlour || occupiedSpaces.has(`${point[0]},${point[1]}`)) {
          isPossible = false;
        }
      });
      if (isPossible) {
        currentRock = simulatedMovedRockByGravity;
      } else {
        // The rock reached its final position (it couldn't move down)
        let maxPointY = minFlour;
        currentRock.forEach(point => {
          occupiedSpaces.set(`${point[0]},${point[1]}`, true);
          maxPointY = Math.max(maxPointY, point[1] + 1);
        });
        const prevLevel = currentLevel;
        currentLevel = Math.max(currentLevel, maxPointY);
        deltaInLevelChanges.push(prevLevel - currentLevel);
        rockCounter++;

        // break the while true loop
        break;
      }
    }
  }
  // console.log(deltaInLevelChanges.join(', '));
  return currentLevel;
}

// Part 1
(function part1(goal = 2_022) {
  console.log({part1: getHeightAfterNbRocks(goal)}); // 3083
})();


// Part 2
(function part2(goal = 1_000_000_000_000) {
  /*
  * In this part you have to find the first repeating sequence
  * (that's why there's an array called deltaInLevelChanges and an output.txt),
  * with my input the repeating sequence started after the
  * 429th character and its length was 1740 character long.
  *
  * You can easily do this part (finding startOffset & nbCharsForRepeatingSequence)
  * programmatically. I didn't bother.
   */
  const startOffset = 429;
  const nbCharsForRepeatingSequence = 1740;

  const startingBunchHeight = getHeightAfterNbRocks(startOffset);
  const nbOfSequences = Math.floor((goal - startOffset) / nbCharsForRepeatingSequence);
  const rest = (goal - startOffset) % nbCharsForRepeatingSequence;
  const heightOfBase =
    getHeightAfterNbRocks(startOffset +nbCharsForRepeatingSequence)
    - startingBunchHeight;
  const heightOfRest = getHeightAfterNbRocks(startOffset + rest) - startingBunchHeight;
  const ans = startingBunchHeight + (nbOfSequences * heightOfBase) + heightOfRest;

  console.log({part2: ans});
})(); // 1532183908048