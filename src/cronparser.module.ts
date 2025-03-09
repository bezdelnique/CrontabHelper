export class CronParser {
    month = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

    zeroLength: number = 0;
    pos: number = 0
    line: string = "";

    public parse(line: string): CronResult {
        this.line = line
        this.zeroLength = line.length - 1;

        let pos = 0;
        let result: Array<Tick> = [];
        let current = new Tick();
        for (let i = 0; i < line.length; i++) {
            let ch: string = line.charAt(i);
            if (ch === "*") {
                if (this.isNextSlash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i);
                    i = ret.i;
                    result[pos] = Tick.ofStep(ret.value);
                } else {
                    current = new Tick();
                    result[pos] = current;
                }
                pos++;
                i++;
            } else if (this.isLetter(ch)) {
                if (pos != Position.MONTH && pos != Position.DAY_OF_WEEK) {
                    throw new Error('Letter character does not allow for [' + pos + '] at position ' + i);
                }
                let ret = this.parseToken(i);
                i = ret.i;
                if (i != this.zeroLength && this.line.charAt(i + 1) != ' ') {
                    throw new Error('Expected letter space or end of string' + i);
                }
                result[pos] = Tick.ofValue(ret.value);
                pos++;
                i++;
            } else if (this.isNumber(ch)) {
                let ret = this.parseNumber(i);
                i = ret.i;
                let from = ret.value;

                let tick = new Tick();
                // 2-4
                if (this.isNextDash(i)) {
                    i = i + 2; // Confidently move the pointer by two positions
                    let ret = this.parseNumber(i);
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
                    let ret = this.parseNumber(i);
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
            this.pos = pos;
        }
        // last
        // result[pos] = current;

        return new CronResult(result);
    }

    private getMinMax(pos: number) {
        let min = 0;
        let max = 0;
        switch (pos) {
            case Position.MINUTE:
                min = 0;
                max = 59;
                break;
            case Position.HOUR:
                min = 0;
                max = 23;
                break;
            case Position.DAY_OF_MONTH:
                min = 1;
                max = 31;
                break;
            case Position.MONTH:
                min = 1;
                max = 12;
                break;
            case Position.DAY_OF_WEEK:
                min = 0;
                max = 7;
                break;
            default:
                throw new Error('Out of range pos ' + pos);
        }
        return {min: min, max: max}
    }

    private parseNumber(i: number) {
        let min = this.getMinMax(this.pos).min;
        let max = this.getMinMax(this.pos).max;

        let ch = this.line.charAt(i);
        if (!this.isNumber(ch)) {
            throw new Error('Expected number, found [' + ch + '] at position ' + i);
        }

        let digits: string = ch;
        while (this.isNextNumber(i)) {
            i++;
            ch = this.line.charAt(i)
            if (this.isNumber(ch)) {
                digits = digits.concat(ch)
            } else {
                throw new Error('Unexpected character [' + ch + '] at position ' + i);
            }
        }

        let num = Number(digits);
        if (num > max) {
            throw new Error('To big digit [' + num + '>' + max + '] at position ' + i);
        }
        if (num < min) {
            throw new Error('To small digit [' + num + '<' + min + '] at position ' + i);
        }

        return {value: num, i};
    }

    private isNextSlash(i: number) {
        return i + 1 <= this.zeroLength && this.line.charAt(i + 1) == '/';
    }

    private isNumber(str: string): boolean {
        return str.trim() !== "" && !isNaN(Number(str));
    }

    private isNextNumber(i: number): boolean {
        return i + 1 <= this.zeroLength && this.isNumber(this.line.charAt(i + 1));
    }

    private isNextDash(i: number): boolean {
        return i + 1 <= this.zeroLength && this.line.charAt(i + 1) == '-';
    }


    private isLetter(ch: string) {
        return /^[A-Za-z]$/.test(ch);
    }

    private parseToken(i: number) {
        let letters = this.line.charAt(i);
        const needed = i + 2; // Len of string value allays equals 3
        while (i + 1 <= this.zeroLength && i < needed) {
            i++;
            let ch = this.line.charAt(i)
            if (!this.isLetter(ch)) {
                throw new Error('Expected letter character, found [' + ch + '] at position ' + i);
            }
            letters = letters.concat(ch);
        }
        letters = letters.toLowerCase();
        let value = -1;
        if (this.pos == Position.MONTH) {
            value = this.month.indexOf(letters)
        }
        if (this.pos == Position.DAY_OF_WEEK) {
            value = this.dayOfWeek.indexOf(letters);
        }
        if (value == -1) {
            throw new Error('Wrong token, found [' + letters + '] at position ' + i);
        }
        return {value, i};
    }
}

enum TickType {
    ANY,
    VALUE,
    RANGE,
    STEP,
    STEP_RANGE,
}

enum Position {
    MINUTE,
    HOUR,
    DAY_OF_MONTH,
    MONTH,
    DAY_OF_WEEK,
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
