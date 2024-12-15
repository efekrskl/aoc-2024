const file = Deno.readTextFileSync("./input.txt").trim();

const directions: Record<string, [number, number]> = {
    "^": [-1, 0],
    "v": [1, 0],
    "<": [0, -1],
    ">": [0, 1],
};

const isInBounds = (
    arr: unknown[][],
    posY: number,
    posX: number,
    mapThicknessX: number,
    mapThicknessY: number,
): boolean =>
    posY >= mapThicknessY && posY < arr.length - mapThicknessY &&
    posX >= mapThicknessX &&
    posX < arr[posY].length - mapThicknessX;

const parseInput = (
    input: string,
): { grid: string[][]; moves: [number, number][] } => {
    const fileAsRows = input.split("\n");
    const lineBreakIndex = fileAsRows.findIndex((row) => row === "");
    const gridRaw = fileAsRows.slice(0, lineBreakIndex);
    const movesRaw = fileAsRows.slice(lineBreakIndex + 1);

    const grid = gridRaw.map((row) => row.split(""));
    const moves = movesRaw
        .flatMap((row) => row.split(""))
        .map((char) => directions[char]);

    return { grid, moves };
};

const parsedInput = parseInput(file);

const moveQueue = new Set<string>();
const canMove = (
    grid: string[][],
    direction: [number, number],
    currY: number,
    currX: number,
): boolean => {
    const nextX = currX + direction[1];
    const nextY = currY + direction[0];

    if (!isInBounds(grid, nextY, nextX, 2, 1) || grid[nextY][nextX] === "#") {
        return false;
    }

    if (grid[nextY][nextX] === "[" || grid[nextY][nextX] === "]") {
        const canMoveAdjacentCrate = canMove(
            grid,
            direction,
            nextY,
            nextX,
        );

        if (!canMoveAdjacentCrate) {
            return false;
        }

        const otherHalfPos = grid[nextY][nextX] === "["
            ? [nextY, nextX + 1]
            : [nextY, nextX - 1];
        if (
            direction[0] !== 0 &&
            !moveQueue.has(`${otherHalfPos[1]}_${otherHalfPos[0]}}`)
        ) {
            const canMoveOtherHalf = canMove(
                grid,
                direction,
                otherHalfPos[0],
                otherHalfPos[1],
            );

            if (!canMoveOtherHalf) {
                return false;
            }
        }
    }

    moveQueue.add(`${currY}_${currX}`);

    return true;
};

const move = (
    grid: string[][],
    direction: [number, number],
    currY: number,
    currX: number,
): boolean => {
    const nextX = currX + direction[1];
    const nextY = currY + direction[0];
    const char = grid[currY][currX];

    if (!isInBounds(grid, nextY, nextX, 1, 1) || grid[nextY][nextX] === "#") {
        return false;
    }

    if (grid[nextY][nextX] === "O") {
        const canMoveAdjacentCrate = move(
            grid,
            direction,
            nextY,
            nextX,
        );

        if (!canMoveAdjacentCrate) {
            return false;
        }
    }

    grid[nextY][nextX] = char;
    grid[currY][currX] = ".";

    return true;
};

const printMap = (map: string[][]) =>
    map.forEach((row) => {
        console.log(row.join(""));
    });

const sumGpsCoordinates = (
    grid: string[][],
    crateShape: string,
    topBonus: number,
    leftBonus: number,
): number =>
    grid.reduce((acc, row, rowIndex) => {
        let gpsSum = 0;
        row.forEach((str, colIndex) => {
            if (str === crateShape) {
                gpsSum += (rowIndex * topBonus) + (colIndex * leftBonus);
            }
        });

        return acc + gpsSum;
    }, 0);

const scaleMap = (grid: string[][]): string[][] =>
    grid.map((row) =>
        row.flatMap((char) => {
            if (char === ".") {
                return [".", "."];
            }

            if (char === "O") {
                return ["[", "]"];
            }

            if (char === "#") {
                return ["#", "#"];
            }

            if (char === "@") {
                return ["@", "."];
            }

            return [];
        })
    );

const patrol = (
    { grid, moves }: ReturnType<typeof parseInput>,
): number => {
    let robotY = grid.findIndex((row) => row.includes("@"));
    let robotX = grid[robotY].indexOf("@");

    moves.forEach((direction) => {
        if (move(grid, direction, robotY, robotX)) {
            robotY = robotY + direction[0];
            robotX = robotX + direction[1];
        }
    });

    return sumGpsCoordinates(grid, "O", 100, 1);
};

const patrolWithScaledMap = (
    { grid, moves }: ReturnType<typeof parseInput>,
): number => {
    const scaledGrid = scaleMap(grid);
    let robotY = scaledGrid.findIndex((row) => row.includes("@"));
    let robotX = scaledGrid[robotY].indexOf("@");

    moves.forEach((direction) => {
        if (canMove(scaledGrid, direction, robotY, robotX)) {
            moveQueue.forEach((str) => {
                const [y, x] = str.split("_").map(Number);
                scaledGrid[y + direction[0]][x + direction[1]] =
                    scaledGrid[y][x];
                scaledGrid[y][x] = ".";
            });
            robotY = robotY + direction[0];
            robotX = robotX + direction[1];
        }
        moveQueue.clear();
    });

    return sumGpsCoordinates(scaledGrid, "[", 100, 1);
};

console.log({
    part1: patrol(structuredClone(parsedInput)),
    part2: patrolWithScaledMap(structuredClone(parsedInput)),
});
