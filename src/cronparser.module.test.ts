import {CronParser, CronResult, EveryTick} from "./cronparser.module";

// * * * * * <command to execute>
// | | | | |
// | | | | day of the week (0–6) (Sunday to Saturday;
// | | | month (1–12)             7 is also Sunday on some systems)
// | | day of the month (1–31)
// | hour (0–23)
// minute (0–59)

// * * * * *
// ? * * * *
// */5 * * * *
// * */5 * * *
// * * 3-4 * *
// * * * JAN-DEC *
// * * * * 0-6
test("Every second", () => {
    // expect(fizzBuzz(2)).toBe("1 2 ");
    // expect(fizzBuzz(3)).toBe("1 2 Fizz ");

    let cronResult = new CronParser().parse("* * * * *");
    let everyTick = new EveryTick();

    expect(cronResult.minute.isEqual(everyTick)).toBe(true);
    expect(cronResult.hour.isEqual(everyTick)).toBe(true);
    expect(cronResult.dayOfMonth.isEqual(everyTick)).toBe(true);
    expect(cronResult.month.isEqual(everyTick)).toBe(true);
    expect(cronResult.dayOfWeek.isEqual(everyTick)).toBe(true);
});
