const file = Deno.readTextFileSync("./input.txt");

const MULTIPLY_TOKEN = "mul(";
const DO_TOKEN = "do(";
const DONT_TOKEN = "don't(";

const calculateMultiplication = (
    str: string,
    additionalStatementsEnabled: boolean,
) => {
    let i = 0;
    let sum = 0;
    let isDoMode = true;

    while (i < str.length) {
        if (
            isDoMode &&
            str.substring(i, i + MULTIPLY_TOKEN.length) === MULTIPLY_TOKEN
        ) {
            i += MULTIPLY_TOKEN.length;

            let j = i;
            while (!Number.isNaN(parseInt(str[j]))) {
                j++;
            }

            const firstParam = str.substring(i, j);
            i = j;

            if (str[i] === ",") {
                i++;
                j = i;

                while (!Number.isNaN(parseInt(str[j]))) {
                    j++;
                }

                const secondParam = str.substring(i, j);
                i = j;

                if (str[i] === ")") {
                    sum += parseInt(firstParam) * parseInt(secondParam);
                }
            }
        } else if (
            additionalStatementsEnabled
        ) {
            if (
                isDoMode &&
                str.substring(i, i + DONT_TOKEN.length) === DONT_TOKEN
            ) {
                i += DONT_TOKEN.length;

                if (str[i] === ")") {
                    isDoMode = false;
                }
            } else if (
                !isDoMode &&
                str.substring(i, i + DO_TOKEN.length) === DO_TOKEN
            ) {
                i += DO_TOKEN.length;

                if (str[i] === ")") {
                    isDoMode = true;
                }
            }
        }

        i++;
    }

    return sum;
};

console.log({
    part1: calculateMultiplication(file, false),
    part2: calculateMultiplication(file, true),
});
