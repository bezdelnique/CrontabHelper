import {CronParser, CronResult, Tick} from "./cronparser.module";

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
test("Every minute", () => {
    let cronResult = new CronParser().parse("* * * * *");
    let anyTick = new Tick();

    expect(cronResult.minute.isEqual(anyTick)).toBe(true);
    expect(cronResult.hour.isEqual(anyTick)).toBe(true);
    expect(cronResult.dayOfMonth.isEqual(anyTick)).toBe(true);
    expect(cronResult.month.isEqual(anyTick)).toBe(true);
    expect(cronResult.dayOfWeek.isEqual(anyTick)).toBe(true);
});

test("Every fifth minute of hour", () => {
    let cronResult = new CronParser().parse("5 * * * *");
    let expected = new Tick(5);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});

test("Every fifteenth minute of hour", () => {
    let cronResult = new CronParser().parse("15 * * * *");
    let expected = new Tick(15);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});
