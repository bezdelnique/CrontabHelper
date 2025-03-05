export class CronParser {
    // public name: string;
    // public color: string;
    //
    // constructor(name: string, color: string) {
    //     this.name = name;
    //     this.color = color;
    // }
    //
    // public move(distanceMeter: number) : string {
    //     return `${this.name} moved ${distanceMeter}m.`;
    // }
    //
    // public say() : string {
    //     return `Cat ${this.name} says meow`;
    // }

    public parse(cronline: string) : string | null {
        //return `Cat ${this.name} says meow`;
        return null;
    }
}

export class EveryTick {

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

    constructor(result: any[]) {
        this.minute = [0];
        this.hour = result[1];
        this.dayOfMonth = result[2];
        this.month = result[3];
        this.dayOfWeek = result[4];
    }
}
