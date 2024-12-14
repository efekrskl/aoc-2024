const file = Deno.readTextFileSync("./input.txt").trim();
const robotDataList = file.split("\n");

const extractNumericValue = (str: string): number =>
    Number(str.replace(/[^\d-]/g, ""));

const parseRobotData = (
    str: string,
): {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
} => {
    const [pos, velocity] = str.split(" ");
    const [posX, posY] = pos.split(",").map(extractNumericValue);
    const [velocityX, velocityY] = velocity.split(",").map(extractNumericValue);

    return {
        position: {
            x: posX,
            y: posY,
        },
        velocity: {
            x: velocityX,
            y: velocityY,
        },
    };
};

const MAP_DIMENSIONS = {
    height: 103,
    width: 101,
};

const generateMapGrid = () => {
    return new Array(MAP_DIMENSIONS.height)
        .fill(null)
        .map(() => new Array(MAP_DIMENSIONS.width).fill("."));
};
const MAP_GRID = generateMapGrid();

const move = (
    robotData: ReturnType<typeof parseRobotData>,
    times: number,
): ReturnType<typeof parseRobotData> => {
    if (times === 0) {
        return robotData;
    }

    robotData.position = {
        x: robotData.position.x + robotData.velocity.x,
        y: robotData.position.y + robotData.velocity.y,
    };

    if (robotData.position.x < 0) {
        robotData.position.x += MAP_DIMENSIONS.width;
    } else if (robotData.position.x > MAP_DIMENSIONS.width - 1) {
        robotData.position.x -= MAP_DIMENSIONS.width;
    }

    if (robotData.position.y < 0) {
        robotData.position.y += MAP_DIMENSIONS.height;
    } else if (robotData.position.y > MAP_DIMENSIONS.height - 1) {
        robotData.position.y -= MAP_DIMENSIONS.height;
    }

    times--;

    return move(robotData, times);
};

const quadrantMap = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
};

const addToQuadrantMap = (x: number, y: number) => {
    const widthLine = Math.floor(MAP_DIMENSIONS.width / 2);
    const heightLine = Math.floor(MAP_DIMENSIONS.height / 2);

    if (x < widthLine && y < heightLine) {
        return quadrantMap[0]++;
    } else if (x > widthLine && y < heightLine) {
        return quadrantMap[1]++;
    } else if (x < widthLine && y > heightLine) {
        return quadrantMap[2]++;
    } else if (x > widthLine && y > heightLine) {
        return quadrantMap[3]++;
    }
};

robotDataList
    .map(parseRobotData)
    .map((robotData) => move(robotData, 100))
    .forEach(({ position: { x, y } }) => addToQuadrantMap(x, y));

const drawMap = (list: ReturnType<typeof parseRobotData>[]) => {
    const map: string[][] = structuredClone(MAP_GRID);

    list.forEach(({ position: { x, y } }) => {
        if (map[y][x] === ".") {
            map[y][x] = "X";
        } else {
            throw new Error("Probably not this tree");
        }
    });
    map.forEach((row) => {
        console.log(row.join(""));
    });

    return map;
};

const visualizeTree = (list: ReturnType<typeof parseRobotData>[]) => {
    const seconds = Array.from(Array(10000).keys());
    let parsedRobotDataList = robotDataList
        .map(parseRobotData);

    seconds.forEach((second) => {
        console.log({ second: second + 1 });
        parsedRobotDataList = parsedRobotDataList.map((robotData) =>
            move(robotData, 1)
        );

        try {
            drawMap(parsedRobotDataList);
        } catch {}
    });
};

const calculateSafetyFactor = (map: typeof quadrantMap): number =>
    Object.values(map).reduce((curr, acc) => curr * acc, 1);

console.log({
    part1: calculateSafetyFactor(quadrantMap),
    // part2: visualizeTree(robotDataList.map(parseRobotData))
});
