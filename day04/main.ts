const file = Deno.readTextFileSync("./input.txt");
const array = file.split("\n").map((row) => row.split("")).filter((arr) =>
    arr.length > 0
);

const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
];
const WORD_MAS = "MAS";

const traverse = (
    arr: string[][],
    row: number,
    col: number,
    dir: number[],
    str: string,
    index: number = 0,
): number => {
    if (index === str.length) {
        return 1;
    }

    if (
        row < 0 || row >= arr.length ||
        col < 0 || col >= arr[row].length ||
        arr[row][col] !== str[index]
    ) {
        return 0;
    }

    return traverse(arr, row + dir[0], col + dir[1], dir, str, index + 1);
};

const searchWord = (arr: string[][], word: string): number => {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === "X") {
                for (const dir of DIRECTIONS) {
                    count += traverse(arr, i + dir[0], j + dir[1], dir, word);
                }
            }
        }
    }

    return count;
};

const X_SHAPE_DIRECTIONS = [
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
];
const CHAR_MATCHES = {
    M: "S",
    S: "M",
};

const searchXShapedWord = (arr: string[][]): number => {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === "A") {
                let validMatches = 0;
                for (const [dirRow, dirCol] of X_SHAPE_DIRECTIONS) {
                    const newRow = i + dirRow;
                    const newCol = j + dirCol;

                    if (
                        newRow < 0 || newRow >= arr.length ||
                        newCol < 0 || newCol >= arr[newRow].length
                    ) {
                        continue;
                    }

                    const char = arr[newRow][newCol];
                    if (char === "M" || char === "S") {
                        const oppositeChar = CHAR_MATCHES[char];
                        const oppositeRow = i - dirRow;
                        const oppositeCol = j - dirCol;

                        if (
                            oppositeRow < 0 || oppositeRow >= arr.length ||
                            oppositeCol < 0 || oppositeCol >= arr[newRow].length
                        ) {
                            continue;
                        }

                        if (arr[oppositeRow][oppositeCol] === oppositeChar) {
                            validMatches++;
                        }
                    }
                }

                if (validMatches === 4) {
                    count++;
                }
            }
        }
    }

    return count;
};

console.log({
    part1: searchWord(array, WORD_MAS),
    part2: searchXShapedWord(array),
});
