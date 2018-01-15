
// tslint:disable-next-line
interface Number {
    RoundDecimal(inPlace: number): number;
}

if (!Number.prototype.RoundDecimal) {
    Number.prototype.RoundDecimal = function(inPlace: number): number {
        const lShift: number = Math.pow(10, inPlace);
        const lResult: number = Math.round((Number(this) + 0.00001) * lShift) / lShift;
        return lResult;
    };
}
