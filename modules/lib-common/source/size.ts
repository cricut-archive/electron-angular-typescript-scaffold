export class Size {
    constructor(public Width: number = 0, public Height: number = 0) {}

    public Clone(): Size {
        return new Size(this.Width, this.Height);
    }

    public get Area(): number {
        return this.Width * this.Height;
    }

}
