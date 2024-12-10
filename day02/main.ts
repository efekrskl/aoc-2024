const file = Deno.readTextFileSync("./input.txt");
const rowsRaw = file.split("\n").filter(Boolean);

const isSafeReport = (nums: number[]): boolean => {
    const changes = nums.slice(1).map((num, i) => num - nums[i]);

    const hasSafeChanges = changes
        .map(Math.abs)
        .every((num) => num >= 1 && num <= 3);
    if (!hasSafeChanges) {
        return false;
    }

    const isOnlyIncreaseOrDecrease = changes.every((num) => num > 0) ||
        changes.every((num) => num < 0);

    return isOnlyIncreaseOrDecrease;
};

const rowToNumbers = (row: string): number[] => row.split(" ").map(Number);

const countSafeReports = (rows: string[]): number =>
    rows
        .map(rowToNumbers)
        .filter(isSafeReport).length;

const getSubarrays = (arr: number[]): number[][] =>
    arr.map((_, i) => arr.filter((_, j) => i !== j));

const getSafeReportsWithDampener = (rows: string[]) =>
    rows
        .map(rowToNumbers)
        .filter((row) => getSubarrays(row).some(isSafeReport)).length;

console.log({
    part1: countSafeReports(rowsRaw),
    part2: getSafeReportsWithDampener(rowsRaw),
});
