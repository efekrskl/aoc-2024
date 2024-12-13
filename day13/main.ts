const file = Deno.readTextFileSync("./input.txt")
    .trim()
    .split("\n")
    .filter(Boolean);

const parseGameElement = (str: string): { x: number; y: number } => {
    const [leftSide, rightSide] = str.split(",");

    return {
        x: Number(
            `${leftSide.replace(/\D/g, "")}`,
        ),
        y: Number(
            `${rightSide.replace(/\D/g, "")}`,
        ),
    };
};

const games = file
    .reduce<string[][]>((acc, curr, index) => {
        if (index % 3 !== 0) {
            return acc;
        }

        acc.push([curr, file[index + 1], file[index + 2]]);

        return acc;
    }, [])
    .map((game) => game.map(parseGameElement));

const solveEquations = (
    c1: number,
    c2: number,
    { x: a1, y: a2 }: { x: number; y: number },
    { x: b1, y: b2 }: { x: number; y: number },
) => {
    const determinant = (a1 * b2) - (b1 * a2);

    if (determinant === 0) {
        return 0;
    }

    const dX = (c1 * b2) - (c2 * b1);
    const dY = (c2 * a1) - (c1 * a2);
    const x = dX / determinant;
    const y = dY / determinant;

    if (Number.isInteger(x) && Number.isInteger(y)) {
        return (x * 3) + y;
    }

    return 0;
};

const play = (gameList: typeof games, offset = 0): number =>
    gameList
        .map(([buttonA, buttonB, { x: targetX, y: targetY }]) =>
            solveEquations(
                targetX + offset,
                targetY + offset,
                buttonA,
                buttonB,
            )
        )
        .reduce(
            (acc, curr) => acc + curr,
            0,
        );

console.log({
    part1: play(games),
    part2: play(games, 1e13),
});
