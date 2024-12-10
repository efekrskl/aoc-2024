const file = Deno.readTextFileSync("./input.txt");
const arr: number[][] = file.split("\n").map((row) =>
    row.split("").map(Number)
);
arr.pop();

const DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const isInBounds = (
    arr: number[][],
    posY: number,
    posX: number,
): boolean =>
    posY >= 0 && posY < arr.length && posX >= 0 && posX < arr[posY].length;

const traverse = (
    grid: number[][],
    row: number,
    col: number,
    mode: "score" | "rating",
    lastNum = -1,
    alreadyVisited: Set<string> = new Set(),
): number => {
    if (!isInBounds(grid, row, col)) {
        return 0;
    }

    const currentNum = grid[row][col];
    if (currentNum !== lastNum + 1) {
        return 0;
    }

    if (mode === "score") {
        const coordinates = `${row}_${col}`;
        if (alreadyVisited.has(coordinates)) {
            return 0;
        }

        alreadyVisited.add(coordinates);
    }

    if (currentNum === 9) {
        return 1;
    }

    let score = 0;
    for (const [deltaRow, deltaCol] of DIRECTIONS) {
        score += traverse(
            grid,
            row + deltaRow,
            col + deltaCol,
            mode,
            currentNum,
            alreadyVisited,
        );
    }

    return score;
};

const calculateScoreOrRating = (
    grid: number[][],
    mode: "score" | "rating",
): number => {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const char = grid[i][j];

            if (char !== 0) {
                continue;
            }

            count += traverse(
                grid,
                i,
                j,
                mode,
            );
        }
    }

    return count;
};

console.log({
    part1: calculateScoreOrRating(arr, "score"),
    part2: calculateScoreOrRating(arr, "rating"),
});
