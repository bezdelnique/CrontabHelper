export class CronParser {
    public parse(line: string): CronResult {
        //let line: string = "* * * * *";
        line = line.trim();
        //let zeroLength = line.length - 1;
        let pos = 0;
        let result: Array<EveryTick> = [];
        let current = new EveryTick();
        for (let i = 0; i < line.length; i++) {
            const ch: string = line[i];
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

        return new CronResult(result);
    }
}

export class EveryTick {
    isEqual(other: EveryTick): boolean {
        return this instanceof EveryTick && other instanceof EveryTick;
    }
}

// * * * * * <command to execute>
// | | | | |
// | | | | day of the week (0–6) (Sunday to Saturday;
// | | | month (1–12)             7 is also Sunday on some systems)
// | | day of the month (1–31)
// | hour (0–23)
// minute (0–59)
export class CronResult {
    minute: EveryTick;
    hour: EveryTick;
    dayOfMonth: EveryTick;
    month: EveryTick;
    dayOfWeek: EveryTick;

    // constructor(result: any[]) {
    //     this.minute = result[0];
    //     this.hour = result[1];
    //     this.dayOfMonth = result[2];
    //     this.month = result[3];
    //     this.dayOfWeek = result[4];
    // }

    constructor([minute, hour, dayOfMonth, month, dayOfWeek]: EveryTick[]) {
        this.minute = minute;
        this.hour = hour;
        this.dayOfMonth = dayOfMonth;
        this.month = month;
        this.dayOfWeek = dayOfWeek;
    }

}
