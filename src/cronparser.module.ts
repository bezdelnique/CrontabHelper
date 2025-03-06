export class CronParser {
    zeroLength: number = 0;
    line: string = "";

    public parse(line: string): CronResult {
        //let line: string = "* * * * *";
        this.line = line
        this.zeroLength = line.length - 1;

        const max = 59;
        let pos = 0;
        let result: Array<Tick> = [];
        let current = new Tick();
        for (let i = 0; i < line.length; i++) {
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

                if (this.isNextDash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i, max);
                    i = ret.i;
                    let to = ret.value;
                    result[pos] = new Tick(from, to);
                } else {
                    result[pos] = new Tick(from);
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
    DETERMINED,
    RANGE,
    STEP,
}

export class Tick {
    type: TickType = TickType.ANY;
    first: number = 0;
    second: number = 0;

    constructor();
    constructor(first: number);
    constructor(first: number, second: number);
    constructor(first?: number, second?: number) {
        if (first && second) {
            this.type = TickType.RANGE;
            this.first = first;
            this.second = second;
        } else if (first) {
            this.type = TickType.DETERMINED;
            this.first = first;
        }
    }

    isEqual(other: Tick): boolean {
        return this.type === other.type
            && this.first === other.first
            && this.second === other.second;
    }

    static ofStep(step: number) {
        let tick = new Tick(step);
        tick.type = TickType.STEP;
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
