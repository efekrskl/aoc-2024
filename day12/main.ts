const file = Deno.readTextFileSync("./input.txt");
const arr = file.split("\n").map((row) => row.split(""));
arr.pop();

const DIRECTIONS = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const isInBounds = (
  arr: unknown[][],
  posY: number,
  posX: number,
): boolean =>
  posY >= 0 && posY < arr.length && posX >= 0 && posX < arr[posY].length;

const exploredPositions = new Set<string>();
const exploreArea = (
  grid: string[][],
  y: number,
  x: number,
  char: string,
): number => {
  if (!isInBounds(grid, y, x) || char !== grid[y][x]) {
    return 0;
  }

  const position = `a_${y}_${x}`;
  if (exploredPositions.has(position)) {
    return 0;
  }
  exploredPositions.add(position);

  let totalArea = 1;
  for (const [deltaY, deltaX] of DIRECTIONS) {
    totalArea += exploreArea(
      grid,
      y + deltaY,
      x + deltaX,
      char,
    );
  }

  return totalArea;
};

const explorePerimeter = (
  grid: string[][],
  y: number,
  x: number,
  char: string,
): number => {
  if (!isInBounds(grid, y, x) || char !== grid[y][x]) {
    return 0;
  }

  const position = `p_${y}_${x}`;
  if (exploredPositions.has(position)) {
    return 0;
  }
  exploredPositions.add(position);

  let totalPerimeter = 0;
  for (const [deltaY, deltaX] of DIRECTIONS) {
    if (grid[y + deltaY]?.[x + deltaX] !== char) {
      totalPerimeter++;
    }

    totalPerimeter += explorePerimeter(
      grid,
      y + deltaY,
      x + deltaX,
      char,
    );
  }

  return totalPerimeter;
};

const exploreSides = (
  grid: string[][],
  y: number,
  x: number,
  char: string,
): number => {
  if (!isInBounds(grid, y, x) || char !== grid[y][x]) {
    return 0;
  }

  const position = `s_${y}_${x}`;
  if (exploredPositions.has(position)) {
    return 0;
  }
  exploredPositions.add(position);

  let totalPerimeter = 0;
  for (let i = 0; i < DIRECTIONS.length; i++) {
    const [firstDeltaY, firstDeltaX] = DIRECTIONS[i];
    const [secondDeltaY, secondDeltaX] = DIRECTIONS[(i + 1) % 4];

    const left = grid[y + firstDeltaY]?.[x + firstDeltaX];
    const right = grid[y + secondDeltaY]?.[x + secondDeltaX];
    const middle = grid[y + firstDeltaY + secondDeltaY]
      ?.[x + firstDeltaX + secondDeltaX];

    if (
      left !== char && right !== char ||
      (left === char && right === char && middle !== char)
    ) {
      totalPerimeter++;
    }

    totalPerimeter += exploreSides(
      grid,
      y + firstDeltaY,
      x + firstDeltaX,
      char,
    );
  }

  return totalPerimeter;
};

const calculate = (grid: string[][]) => {
  let fullPrice = 0;
  let discountedPrice = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const char = grid[i][j];

      const position = `${i}_${j}`;
      if (
        exploredPositions.has(position)
      ) {
        continue;
      }

      const area = exploreArea(grid, i, j, char);
      const perimeter = explorePerimeter(grid, i, j, char);
      const sides = exploreSides(grid, i, j, char);

      fullPrice += area * perimeter;
      discountedPrice += area * sides;
    }
  }

  return { fullPrice, discountedPrice };
};

const { fullPrice, discountedPrice } = calculate(arr);
console.log({
  part1: fullPrice,
  part2: discountedPrice,
});
