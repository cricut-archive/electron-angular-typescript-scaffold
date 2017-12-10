import {NativeModel} from './models/protobuf/NativeModel';

export class Point {
    constructor(public x: number = 0, public y: number = 0) {}

    public Clone(): Point {
        return new Point(this.x, this.y);
    }

    public fromJSON(inJson: Point): Point {
        this.x = inJson.x;
        this.y = inJson.y;
        return this;
    }

    public fromProto(inProto: NativeModel.IPoint): Point {
        this.x = inProto.x || 0;
        this.y = inProto.y || 0;
        return this;
    }

    public toJSON(): Point {
        // SERIALIZE DATA TO SAVE
        // COMMENTED OUT PROPERTIES ARE NOT NEED TO DESERIALIZE THIS OBJECT
        var lJson: Point = ({} as Point);

        lJson.x = this.x;
        lJson.y = this.y;

        return lJson;
    }

    public Add(inPoint: Point) {
        this.x += inPoint.x;
        this.y += inPoint.y;
    }

    static Subtract(inPoint1: Point, inPoint2: Point): Point {
        var lPoint: Point = new Point(inPoint1.x - inPoint2.x, inPoint1.y - inPoint2.y);
        return lPoint;
    }

    static MinXY(inPoint: Point[]): Point|null {
        let lMinPoint: Point;
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
