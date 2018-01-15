
import {Point} from 'lib-common/point';
import {Size} from 'lib-common/size';

export class Rect {
    constructor(public mPoint: Point = new Point(), public mSize: Size = new Size()) {}

    public Clone(): Rect {
        const lClone: Rect = new Rect(this.mPoint.Clone(), this.mSize.Clone());
        return lClone;
    }

    public Expand(inSize: number) {
        this.mPoint.x -= inSize;
        this.mPoint.y -= inSize;
        this.mSize.Width += (inSize * 2);
        this.mSize.Height += (inSize * 2);
    }

    public get Width(): number {
        return this.mSize.Width;
    }
    public set Width(val: number) {
        this.mSize.Width = val;
    }

    public get Height(): number {
        return this.mSize.Height;
    }

    public set Height(val: number) {
        this.mSize.Height = val;
    }

    public get Left(): number {
        return this.mPoint.x;
    }
    public set Left(val: number) {
        this.mPoint.x = val;
    }

    public get Right(): number {
        return this.mPoint.x + this.mSize.Width;
    }
    public set Right(val: number) {
        this.mPoint.x = val - this.mSize.Width;
    }

    public get Top(): number {
        return this.mPoint.y;
    }
    public set Top(val: number) {
        this.mPoint.y = val;
    }

    public get Bottom(): number {
        return this.mPoint.y + this.mSize.Height;
    }

    public set Bottom(val: number) {
        this.mPoint.y = val - this.mSize.Height;
    }

    public get Center(): Point {
        return new Point(this.Left + (this.Width / 2), this.Top + (this.Height / 2));
    }

    public get Area(): number {
        return this.Width * this.Height;
    }

    public ContainsPoint(inPoint: Point, scale: number): boolean {
        return this.Left * scale <= inPoint.x
            && this.Top * scale <= inPoint.y
            && this.Right * scale >= inPoint.x
            && this.Bottom * scale >= inPoint.y;
    }
}
