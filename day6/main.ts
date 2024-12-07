const file = Deno.readTextFileSync("./input.txt");
const map = file.split("\n").map((row) => row.split(""));
map.pop();

enum Direction {
    NORTH = "NORTH",
    SOUTH = "SOUTH",
    WEST = "WEST",
    EAST = "EAST",
}

const GUARD_FACING_DIRECTIONS: Record<string, Direction> = {
    "^": Direction.NORTH,
    ">": Direction.EAST,
    "v": Direction.SOUTH,
    "<": Direction.WEST,
};

const MOVEMENTS_BY_DIRECTIONS = {
    [Direction.NORTH]: [-1, 0],
    [Direction.EAST]: [0, 1],
    [Direction.SOUTH]: [1, 0],
    [Direction.WEST]: [0, -1],
};

const checkIfInBounds = (
    arr: string[][],
    posY: number,
    posX: number,
): boolean =>
    posY >= 0 && posY < arr.length && posX >= 0 && posX < arr[posY].length;

const getNextGuardFacingDirection = (dir: Direction): Direction => {
    switch (dir) {
        case Direction.NORTH:
            return Direction.EAST;
        case Direction.EAST:
            return Direction.SOUTH;
        case Direction.SOUTH:
            return Direction.WEST;
        case Direction.WEST:
            return Direction.NORTH;
    }
};

const getCurrentGuardPos = (arr: string[][]): {
    direction: Direction;
    posX: number;
    posY: number;
} | undefined => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (GUARD_FACING_DIRECTIONS[arr[i][j]]) {
                return {
                    direction: GUARD_FACING_DIRECTIONS[arr[i][j]],
                    posX: j,
                    posY: i,
                };
            }
        }
    }
};

const getPatrolledPositions = (arr: string[][]): Set<string> => {
    const visitedPositions = new Set<string>();
    const guardPos = getCurrentGuardPos(arr);

    if (!guardPos) {
        return visitedPositions;
    }

    let { posX, posY, direction } = guardPos;

    while (checkIfInBounds(arr, posY, posX)) {
        const [moveY, moveX] = MOVEMENTS_BY_DIRECTIONS[direction];
        const nextPos = `${posY}_${posX}`;
        const nextY = posY + moveY;
        const nextX = posX + moveX;

        if (arr.at(nextY)?.at(nextX) === "#") {
            direction = getNextGuardFacingDirection(
                direction,
            );
            continue;
        }

        posY = nextY;
        posX = nextX;
        visitedPositions.add(nextPos);
    }

    return visitedPositions;
};

const checkPatrolLoop = (arr: string[][]): boolean => {
    const visitedPositions = new Set<string>();
    const guardPos = getCurrentGuardPos(arr);

    if (!guardPos) {
        return false;
    }

    let { posX, posY, direction } = guardPos;

    while (checkIfInBounds(arr, posY, posX)) {
        const [moveY, moveX] = MOVEMENTS_BY_DIRECTIONS[direction];
        const nextPos = `${posY}_${posX}_${direction}`;
        const nextY = posY + moveY;
        const nextX = posX + moveX;

        if (visitedPositions.has(nextPos)) {
            return true;
        }

        if (arr.at(nextY)?.at(nextX) === "#") {
            direction = getNextGuardFacingDirection(
                direction,
            );
            continue;
        }

        posY = nextY;
        posX = nextX;
        visitedPositions.add(nextPos);
    }

    return false;
};

const countPossibleBlocksForLooping = (arr: string[][]): number => {
    let count = 0;
    const visitedPositions: number[][] = [...getPatrolledPositions(arr)].map((
        pos,
    ) => pos.split("_")).map((pos) => pos.map(Number));

    visitedPositions.forEach(([posY, posX]) => {
        if (arr[posY][posX] !== ".") {
            return;
        }

        arr[posY][posX] = "#";

        if (checkPatrolLoop(arr)) {
            count++;
        }

        arr[posY][posX] = ".";
    });

    return count;
};

console.log({
    part1: getPatrolledPositions(map).size,
    part2: countPossibleBlocksForLooping(map),
});
