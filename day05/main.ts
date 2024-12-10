const file = Deno.readTextFileSync("./input.txt").split("\n");

const splitRowIndex = file.indexOf("");
const rulesRaw = file.slice(0, splitRowIndex);
const updatesRaw = file.slice(splitRowIndex + 1).filter(Boolean);

const buildRuleMap = (rules: string[]): Map<number, Set<number>> => {
    const ruleMap = new Map<number, Set<number>>();

    rules
        .map((rule) => rule.split("|").map(Number))
        .forEach(
            ([leftNum, rightNum]) => {
                if (!ruleMap.has(leftNum)) {
                    ruleMap.set(leftNum, new Set());
                }

                ruleMap.get(leftNum)?.add(rightNum);
            },
        );

    return ruleMap;
};

const isValidUpdate = (
    update: number[],
    ruleMap: ReturnType<typeof buildRuleMap>,
): boolean => {
    for (let i = 0; i < update.length; i++) {
        const lessPriorityNumbers = ruleMap.get(update[i]);

        if (!lessPriorityNumbers) {
            continue;
        }

        for (let j = 0; j < i; j++) {
            if (lessPriorityNumbers.has(update[j])) {
                return false;
            }
        }
    }

    return true;
};

const getMiddlePageNumber = (arr: number[]): number =>
    arr[Math.floor(arr.length / 2)];

const getValidRows = (
    updates: number[][],
    ruleMap: ReturnType<typeof buildRuleMap>,
) => {
    const validRows: number[] = [];

    updates.forEach((update, index) => {
        if (isValidUpdate(update, ruleMap)) {
            validRows.push(index);
        }
    });

    return validRows;
};

const calculateValidRowsMiddlePageSum = (
    updateLines: string[],
    ruleLines: string[],
): number => {
    const ruleMap = buildRuleMap(ruleLines);
    const updates = updateLines.map((update) => update.split(",").map(Number));
    const validRows: number[] = getValidRows(updates, ruleMap);

    return validRows.reduce(
        (acc, curr) => acc + getMiddlePageNumber(updates[curr]),
        0,
    );
};

const calculateInvalidRowsMiddlePageSum = (
    updateLines: string[],
    ruleLines: string[],
): number => {
    const ruleMap = buildRuleMap(ruleLines);
    const updates = updateLines.map((update) => update.split(",").map(Number));
    const validRows: number[] = getValidRows(updates, ruleMap);
    const invalidRows = updates.filter((_, i) => !validRows.includes(i));

    return invalidRows.map((row) =>
        [...row].sort((a, b) => {
            const lessPriorityNumbers = ruleMap.get(a);

            if (!lessPriorityNumbers) {
                return 0;
            }

            return lessPriorityNumbers.has(b) ? -1 : 1;
        })
    ).reduce(
        (acc, row) => acc + getMiddlePageNumber(row),
        0,
    );
};

console.log({
    part1: calculateValidRowsMiddlePageSum(updatesRaw, rulesRaw),
    part2: calculateInvalidRowsMiddlePageSum(updatesRaw, rulesRaw),
});
