const file = Deno.readTextFileSync("./input.txt");
const rows = file.split("\n").map((row) => row.split(""));
rows.pop();

const getAntennaPositionsMap = (grid: string[][]): Map<string, number[][]> => {
    const map = new Map<string, number[][]>();

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === ".") {
                continue;
            }

            const char = grid[i][j];

            if (!map.has(char)) {
                map.set(char, []);
            }

            map.get(char)!.push([i, j]);
        }
    }

    return map;
};

const checkIfInBounds = (
    arr: string[][],
    posY: number,
    posX: number,
): boolean =>
    posY >= 0 && posY < arr.length && posX >= 0 && posX < arr[posY].length;

const countAntinodesWithResonantHarmonics = (
    map: ReturnType<typeof getAntennaPositionsMap>,
    grid: string[][],
) => {
    const uniqueAntinodes = new Set<string>();

    for (const [_antenna, positions] of map) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const pointA = positions[i];
                const pointB = positions[j];

                uniqueAntinodes.add(pointA.join("_"));
                uniqueAntinodes.add(pointB.join("_"));

                const distance = [
                    pointA[0] - pointB[0],
                    pointA[1] - pointB[1],
                ];

                const antinodeA = [
                    pointA[0] + distance[0],
                    pointA[1] + distance[1],
                ];
                const antinodeB = [
                    pointB[0] - distance[0],
                    pointB[1] - distance[1],
                ];

                while (checkIfInBounds(grid, antinodeA[0], antinodeA[1])) {
                    if (grid[antinodeA[0]][antinodeA[1]] === ".") {
                        uniqueAntinodes.add(antinodeA.join("_"));
                    }

                    antinodeA[0] += distance[0];
                    antinodeA[1] += distance[1];
                }
                while (checkIfInBounds(grid, antinodeB[0], antinodeB[1])) {
                    if (grid[antinodeB[0]][antinodeB[1]] === ".") {
                        uniqueAntinodes.add(antinodeB.join("_"));
                    }

                    antinodeB[0] -= distance[0];
                    antinodeB[1] -= distance[1];
                }
            }
        }
    }

    return uniqueAntinodes.size;
};

const countAntinodes = (
    map: ReturnType<typeof getAntennaPositionsMap>,
    grid: string[][],
) => {
    const uniqueAntinodes = new Set<string>();

    for (const [_antenna, positions] of map) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const pointA = positions[i];
                const pointB = positions[j];
                const distance = [
                    pointA[0] - pointB[0],
                    pointA[1] - pointB[1],
                ];

                const antinodeA = [
                    pointA[0] + distance[0],
                    pointA[1] + distance[1],
                ];
                const antinodeB = [
                    pointB[0] - distance[0],
                    pointB[1] - distance[1],
                ];

                if (checkIfInBounds(grid, antinodeA[0], antinodeA[1])) {
                    uniqueAntinodes.add(antinodeA.join("_"));
                }
                if (checkIfInBounds(grid, antinodeB[0], antinodeB[1])) {
                    uniqueAntinodes.add(antinodeB.join("_"));
                }
            }
        }
    }

    return uniqueAntinodes.size;
};

console.log(
    {
        part1: countAntinodes(getAntennaPositionsMap(rows), rows),
        part2: countAntinodesWithResonantHarmonics(
            getAntennaPositionsMap(rows),
            rows,
        ),
    },
);
