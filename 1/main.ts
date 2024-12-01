const file = Deno.readTextFileSync("./input.txt");
const rowsRaw = file.split("\n");
rowsRaw.pop();

const leftNums: number[] = [];
const rightNums: number[] = [];
rowsRaw
    .map((row) => row.split("   "))
    .map((row) => row.map(Number))
    .forEach(([left, right]) => {
        leftNums.push(left);
        rightNums.push(right);
    });

leftNums.sort();
rightNums.sort();

const totalDistance = leftNums.reduce((acc, left, index) => {
    const right = rightNums[index];

    return acc + (Math.abs(left - right));
}, 0);

const totalSimilarityScore = leftNums.reduce((acc, left) => {
    const occurrenceCount = rightNums.filter((num) => num === left).length;

    return acc + (left * occurrenceCount);
}, 0);

console.log({
    part1: totalDistance,
    part2: totalSimilarityScore,
});
