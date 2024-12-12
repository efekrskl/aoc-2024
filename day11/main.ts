const file = Deno.readTextFileSync("./input.txt");
const nums = file.replace("\n", "").split(" ");

const transform = (number: number): number[] => {
    if (number === 0) {
        return [1];
    }

    const str = number.toString();
    if (str.length % 2 === 0) {
        return [
            str.substring(0, str.length / 2),
            str.substring(str.length / 2),
        ].map(Number);
    }

    return [number * 2024];
};

const blink = (
    number: number,
    times = 1,
    memo: Map<number, number>[] = [],
): number => {
    if (!memo[times]) {
        memo[times] = new Map();
    }

    if (memo[times].has(number)) {
        return memo[times].get(number)!;
    }

    if (times === 1) {
        return transform(number).length;
    }

    const sum = transform(number)
        .map((stone) => blink(stone, times - 1, memo))
        .reduce((acc, curr) => acc + curr, 0);

    memo[times].set(number, sum);

    return sum;
};

const doMagic = (numbers: number[], times = 1): number => {
    return numbers.map((num) => blink(num, times)).reduce(
        (acc, curr) => acc + curr,
        0,
    );
};

console.log({
    part1: doMagic(nums.map(Number), 25),
    part2: doMagic(nums.map(Number), 75),
});
