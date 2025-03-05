import {CronParser, CronResult, EveryTick} from "./cronparser.module";

test("Every second", () => {
    // expect(fizzBuzz(2)).toBe("1 2 ");
    // expect(fizzBuzz(3)).toBe("1 2 Fizz ");

    let line: string = "* * * * *";
    line = line.trim();
    let zeroLength = line.length - 1;
    let pos = 0;
    let result = [];
    let current = null;
    for (let i = 0; i < line.length; i++) {
        const ch: string = line[i];
        // console.log(char);
        if (ch === "*") {
            current = new EveryTick();
        } else if (ch === " ") {
            result[pos] = current;
            pos++;
        } else {
            throw new Error('Unexpected character "' + ch + '"');
        }
    }
    // last
    result[pos] = current;

    new CronResult(result);

});
