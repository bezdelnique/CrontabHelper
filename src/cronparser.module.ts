export class CronParser {
    public parse(line: string): CronResult {
        //let line: string = "* * * * *";
        line = line.trim();
        let zeroLength = line.length - 1;
        let pos = 0;
        let result: Array<Tick> = [];
        let current = new Tick();
        for (let i = 0; i < line.length; i++) {
            let ch: string = line.charAt(i);
            if (ch === "*") {
                current = new Tick();
                result[pos] = current;
                pos++;
                i++;
            } else if (this.isNumeric(ch)) {
                let digits: string = ch;
                while (i + 1 <= zeroLength && line.charAt(i + 1) != " ") {
                    i++;
                    ch = line.charAt(i)
                    if (this.isNumeric(ch)) {
                        digits = digits.concat(ch)
                    } else {
                        throw new Error('Unexpected character [' + ch + '] at position ' + i);
                    }
                }
                result[pos] = new Tick(Number(digits));
                pos++;
                i++;
            } else {
                throw new Error('Unexpected character [' + ch + '] at position ' + i);
            }
        }
        // last
        result[pos] = current;

        return new CronResult(result);
    }

    private isNumeric(str: string): boolean {
        return str.trim() !== "" && !isNaN(Number(str));
    }

}

enum TickType {
    ANY,
    DETERMINED,
}

export class Tick {
    type: TickType = TickType.ANY;
    digits: number = 0;

    constructor();
    constructor(digits: number);
    constructor(digits?: number) {
        if (digits) {
            this.type = TickType.DETERMINED;
            this.digits = digits;
        }
    }

    isEqual(other: Tick): boolean {
        return this.type===other.type
            && this.digits===other.digits;
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
    minute: Tick;
    hour: Tick;
    dayOfMonth: Tick;
    month: Tick;
    dayOfWeek: Tick;

    // constructor(result: any[]) {
    //     this.minute = result[0];
    //     this.hour = result[1];
    //     this.dayOfMonth = result[2];
    //     this.month = result[3];
    //     this.dayOfWeek = result[4];
    // }

    constructor([minute, hour, dayOfMonth, month, dayOfWeek]: Tick[]) {
        this.minute = minute;
        this.hour = hour;
        this.dayOfMonth = dayOfMonth;
        this.month = month;
        this.dayOfWeek = dayOfWeek;
    }

}
