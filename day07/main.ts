const file = Deno.readTextFileSync("./input.txt").split("\n");
const rows = file.filter(Boolean).map((row) => {
    const [sum, rest] = row.split(": ");
    const nums = rest.split(" ");

    nums.unshift(sum);

    return nums.map(Number);
});

enum OPERATION {
    MUL = "MUL",
    ADD = "ADD",
    CNT = "CNT",
}

const multiply = (x: number, y: number): number => x * y;
const add = (x: number, y: number): number => x + y;
const concat = (x: number, y: number): number => Number(`${x}${y}`);

const calculate = (
    nums: number[],
    target: number,
    op: OPERATION,
    supportConcatOp: boolean,
): boolean => {
    const [x, y, ...rest] = nums;

    let newNum;
    if (op === OPERATION.ADD) {
        newNum = add(x, y);
    } else if (op === OPERATION.MUL) {
        newNum = multiply(x, y);
    } else {
        newNum = concat(x, y);
    }

    if (nums.length === 2) {
        return newNum === target;
    }

    const newNums = [newNum, ...rest];

    return calculate(newNums, target, OPERATION.ADD, supportConcatOp) ||
        calculate(newNums, target, OPERATION.MUL, supportConcatOp) ||
        (supportConcatOp &&
            calculate(newNums, target, OPERATION.CNT, supportConcatOp));
};

const evaluateCalculation = (nums: number[][], supportConcatOp: boolean) => {
    let totalSum = 0;
    nums.forEach((row) => {
        const [sum, ...rest] = row;

        if (
            calculate(rest, sum, OPERATION.ADD, supportConcatOp) ||
            calculate(rest, sum, OPERATION.MUL, supportConcatOp) ||
            (supportConcatOp &&
                calculate(rest, sum, OPERATION.CNT, supportConcatOp))
        ) {
            totalSum += sum;
        }
    });

    return totalSum;
};

console.log({ part1: evaluateCalculation(rows, false), part2:  evaluateCalculation(rows, true) });
