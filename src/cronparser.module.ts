export class CronParser {
    month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    dow = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    zeroLength: number = 0;
    line: string = "";

    public parse(line: string): CronResult {
        this.line = line
        this.zeroLength = line.length - 1;

        let max = 59;
        let pos = 0;
        let result: Array<Tick> = [];
        let current = new Tick();
        for (let i = 0; i < line.length; i++) {
            if (pos == 1) {
                max = 23
            }

            let ch: string = line.charAt(i);
            if (ch === "*") {
                if (this.isNextSlash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i, max);
                    i = ret.i;
                    result[pos] = Tick.ofStep(ret.value);
                } else {
                    current = new Tick();
                    result[pos] = current;
                }
                pos++;
                i++;
            } else if (this.isNumeric(ch)) {
                let ret = this.parseNumber(i, max);
                i = ret.i;
                let from = ret.value;

                let tick = new Tick();
                // 2-4
                if (this.isNextDash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i, max);
                    i = ret.i;
                    let to = ret.value;
                    tick = new Tick(from, to);
                } else {
                    tick = new Tick(from);
                }

                // 2-4/3
                // 12/4
                if (this.isNextSlash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i, max);
                    i = ret.i;
                    result[pos] = Tick.ofStepRange(tick.first, tick.second, ret.value);
                } else {
                    result[pos] = tick;
                }

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

    private parseNumber(i: number, max: number) {
        let ch = this.line.charAt(i);
        if (!this.isNumeric(ch)) {
            throw new Error('Expected number, found [' + ch + '] at position ' + i);
        }
        let digits: string = ch;
        //let from: number = 0;
        while (this.isNextNumber(i)) {
            i++;
            ch = this.line.charAt(i)
            if (this.isNumeric(ch)) {
                digits = digits.concat(ch)
            } else {
                throw new Error('Unexpected character [' + ch + '] at position ' + i);
            }
        }
        let number = Number(digits);
        if (number > max) {
            throw new Error('To big digit [' + number + '>' + max + '] at position ' + i);
        }
        return {value: number, i};
    }

    private isNextNumber(i: number): boolean {
        return i + 1 <= this.zeroLength && this.isNumeric(this.line.charAt(i + 1));
    }

    private isNextDash(i: number): boolean {
        return i + 1 <= this.zeroLength && this.line.charAt(i + 1) == "-";
    }

    private isNextSlash(i: number) {
        return i + 1 <= this.zeroLength && this.line.charAt(i + 1) == "/";
    }

    private isNumeric(str: string): boolean {
        return str.trim() !== "" && !isNaN(Number(str));
    }

}

enum TickType {
    ANY,
    VALUE,
    RANGE,
    STEP,
    STEP_RANGE,
}

export class Tick {
    type: TickType = TickType.ANY;
    first: number = -1;
    second: number = -1;
    step: number = -1;

    constructor();
    constructor(first: number);
    constructor(first: number, second: number);
    constructor(first: number, second: number, step: number);
    constructor(first?: number, second?: number, step?: number) {
        // FIXME: 0 is legal
        if (first !== undefined && second !== undefined && step !== undefined) {
            this.type = TickType.STEP_RANGE;
            this.first = first;
            this.second = second;
            this.step = step;
        } else if (first !== undefined && second !== undefined) {
            this.type = TickType.RANGE;
            this.first = first;
            this.second = second;
        } else if (first !== undefined) {
            this.type = TickType.VALUE;
            this.first = first;
        }
    }

    isEqual(other: Tick): boolean {
        return this.type === other.type
            && this.first === other.first
            && this.second === other.second
            && this.step === other.step;
    }

    static ofStep(step: number) {
        let tick = new Tick(0, 0, step);
        tick.type = TickType.STEP;
        return tick;
    }

    static ofValue(value: number) {
        let tick = new Tick(value);
        tick.type = TickType.VALUE;
        return tick;
    }

    static ofStepRange(from: number, to: number, step: number) {
        let tick = new Tick(from, to, step);
        tick.type = TickType.STEP_RANGE;
        return tick;
    }

    static ofRange(from: number, to: number) {
        let tick = new Tick(from, to);
        tick.type = TickType.RANGE;
        return tick;
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
