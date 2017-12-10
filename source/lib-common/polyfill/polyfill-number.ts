interface Number {
    roundDecimal(inPlace: number): number;
}

if (!Number.prototype.roundDecimal) {
    Number.prototype.roundDecimal = function(inPlace: number): number {
        var lShift: number = Math.pow(10, inPlace);
        var lResult: number = Math.round((Number(this) + 0.00001) * lShift) / lShift;
        return lResult;
    };
}
