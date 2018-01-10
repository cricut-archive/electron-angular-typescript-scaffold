
export class Point {
    constructor(public x: number = 0, public y: number = 0) {}

    public Clone(): Point {
        return new Point(this.x, this.y);
    }

    public Add(inPoint: Point): Point {
        this.x += inPoint.x;
        this.y += inPoint.y;
        return this;
    }

    static Subtract(inPoint1: Point, inPoint2: Point): Point {
        var lPoint: Point = new Point(inPoint1.x - inPoint2.x, inPoint1.y - inPoint2.y);
        return lPoint;
    }

    static MinXY(inPoint: Point[]): Point {
        let lMinPoint: Point|null;
        if (inPoint.length) {
            lMinPoint = inPoint[0].Clone();
            inPoint.forEach(lPoint => {
                lMinPoint.x = lPoint.x < lMinPoint.x ? lPoint.x : lMinPoint.x;
                lMinPoint.y = lPoint.y < lMinPoint.y ? lPoint.y : lMinPoint.y;
            });
            return lMinPoint;
        }

        return null;
    }

    static MaxXY(inPoint: Point[]): Point|null {
        let lMaxPoint: Point;
        if (inPoint.length) {
            lMaxPoint = inPoint[0].Clone();
            inPoint.forEach(lPoint => {
                lMaxPoint.x = lPoint.x > lMaxPoint.x ? lPoint.x : lMaxPoint.x;
                lMaxPoint.y = lPoint.y > lMaxPoint.y ? lPoint.y : lMaxPoint.y;
            });
            return lMaxPoint;
        }

        return null;
    }
}
