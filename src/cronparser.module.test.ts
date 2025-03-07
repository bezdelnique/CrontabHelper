import {CronParser, CronResult, Tick} from './cronparser.module';

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
test('Every minute', () => {
    let cronResult = new CronParser().parse('* * * * *');
    let expected = new Tick();

    expect(cronResult.minute.isEqual(expected)).toBe(true);
    expect(cronResult.hour.isEqual(expected)).toBe(true);
    expect(cronResult.dayOfMonth.isEqual(expected)).toBe(true);
    expect(cronResult.month.isEqual(expected)).toBe(true);
    expect(cronResult.dayOfWeek.isEqual(expected)).toBe(true);
});

test('Every fifth minute of hour', () => {
    let cronResult = new CronParser().parse('5 * * * *');
    let expected = new Tick(5);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});

test('Every fifteenth minute of hour', () => {
    let cronResult = new CronParser().parse('15 * * * *');
    let expected = new Tick(15);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});

test('To more minutes', () => {
    expect(() => new CronParser().parse('60 * * * *')).toThrow();
});

test('Every minute from 10 to 20', () => {
    let cronResult = new CronParser().parse('10-20 * * * *');
    let expected = new Tick(10, 20);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});

test('Every ten minute', () => {
    let cronResult = new CronParser().parse('*/10 * * * *');
    let expected = Tick.ofStep(10);
    expect(cronResult.minute.isEqual(expected)).toBe(true);
});

test('Every day at 23:00', () => {
    let cronResult = new CronParser().parse('0 23 * * *');
    let expected = Tick.ofValue(23);
    expect(cronResult.hour.isEqual(expected)).toBe(true);
});

test('To more hour', () => {
    expect(() => new CronParser().parse('0 24 * * *')).toThrow();
});

test('Every step 2 of 1-22 hour', () => {
    let cronResult = new CronParser().parse('* 1-22/2 * * *');
    let expected = Tick.ofStepRange(1, 22, 2);
    expect(cronResult.hour.isEqual(expected)).toBe(true);
});

test('Zero is legal', () => {
    let cronResult = new CronParser().parse('* 0-22/2 * * *');
    let expected = Tick.ofStepRange(0, 22, 2);
    expect(cronResult.hour.isEqual(expected)).toBe(true);
});


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
// * 0-23/2 * * *

// Names  can also be used for the ``month'' and ``day of week'' fields.
// Use the first three letters of the particular day or month (case doesn't matter).
// Ranges or lists of names are not allowed.



