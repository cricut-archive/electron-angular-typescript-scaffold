
export class Point {
    constructor(public x: number = 0, public y: number = 0) {}

    public static Subtract(inPoint1: Point, inPoint2: Point): Point {
        const lPoint: Point = new Point(inPoint1.x - inPoint2.x, inPoint1.y - inPoint2.y);
        return lPoint;
    }

    public static MinXY(inPoint: Point[]): Point|undefined {
        const lMinPoint: Point|undefined = inPoint.length ? inPoint[0].Clone() : undefined;
        if (lMinPoint) {
            inPoint.forEach((lPoint) => {
                lMinPoint.x = lPoint.x < lMinPoint.x ? lPoint.x : lMinPoint.x;
                lMinPoint.y = lPoint.y < lMinPoint.y ? lPoint.y : lMinPoint.y;
            });
        }

        return lMinPoint;
    }

    public static MaxXY(inPoint: Point[]): Point|undefined {
        const lMaxPoint: Point|undefined = inPoint.length ? inPoint[0].Clone() : undefined;
        if (lMaxPoint) {
            inPoint.forEach((lPoint) => {
                lMaxPoint.x = lPoint.x > lMaxPoint.x ? lPoint.x : lMaxPoint.x;
                lMaxPoint.y = lPoint.y > lMaxPoint.y ? lPoint.y : lMaxPoint.y;
            });
        }

        return lMaxPoint;
    }

    public Clone(): Point {
        return new Point(this.x, this.y);
    }

    public Add(inPoint: Point): Point {
        this.x += inPoint.x;
        this.y += inPoint.y;
        return this;
    }

    public Average(inPoint: Point[]): Point {
        const lXPoints = inPoint.map( (p) => p.x);
        const lYPoints = inPoint.map( (p) => p.y);

        let lXAvg = 0;
        lXPoints.map( (p) => lXAvg += p);
        lXAvg /= lXPoints.length;

        let lYAvg = 0;
        lYPoints.map( (p) => lYAvg += p);
        lYAvg /= lYPoints.length;

        return new Point(lXAvg, lYAvg);
    }

}
