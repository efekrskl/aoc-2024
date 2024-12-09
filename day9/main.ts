const file = Deno.readTextFileSync("./input.txt").replace("\n", "");

let idCounter = 0;
const individualBlocks: string[] = file.split("")
    .flatMap(
        (num, index) =>
            Array(Number(num)).fill(index % 2 === 0 ? idCounter++ : "."),
    );

const countDataDigits = (str: string[]): number =>
    str.filter((char) => char !== ".").length;

const getChecksum = (str: string[]) =>
    str.reduce(
        (acc, char, index) => {
            const num = Number(char);
            if (isNaN(num)) {
                return acc;
            }

            return acc + (Number(char) * index);
        },
        0,
    );

const compress = (str: string[]): string[] => {
    const dataCountInStr = countDataDigits(str);

    let j = str.length - 1;
    for (let i = 0; i < dataCountInStr; i++) {
        if (str[i] !== ".") {
            continue;
        }

        while (str[j] === "." && j > 0) {
            j--;
        }

        str[i] = str[j];
        str[j] = ".";
    }

    return str;
};

const compressInBlocks = (str: string[]) => {
    const availableSlots: number[][] = [];
    let j = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== ".") {
            continue;
        }

        j = i;
        while (str[j] === ".") {
            j++;
        }

        const length = j - i;

        availableSlots.push([length, i]);

        i = j;
    }

    const digitsToReplace = [];
    for (let i = str.length; i > 0; i--) {
        if (str[i] === ".") {
            continue;
        }

        j = i;
        if (str[j] === undefined) {
            continue;
        }

        while (j > 0 && str[j - 1] === str[j]) {
            j--;
        }

        const length = i - j;
        digitsToReplace.push([length + 1, i]);

        i = j;
    }

    for (const [length, index] of digitsToReplace) {
        const slot = availableSlots.find(
            ([slotLength]) => slotLength >= length,
        );

        if (!slot) {
            continue;
        }

        if (slot[1] > index) {
            continue;
        }

        for (let i = 0; i < length; i++) {
            str[slot[1] + i] = str[index - i];
            str[index - i] = ".";
        }
        slot[0] -= length;
        slot[1] += length;
    }

    return str;
};

console.log({
    part1: getChecksum(compress([...individualBlocks])),
    part2: getChecksum(compressInBlocks([...individualBlocks]))
})
