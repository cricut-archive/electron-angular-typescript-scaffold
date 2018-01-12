export class Size {
    constructor(public Width: number = 0, public Height: number = 0) {}

    public Clone(): Size {
        return new Size(this.Width, this.Height);
    }

}
