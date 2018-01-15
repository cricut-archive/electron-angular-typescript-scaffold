
// tslint:disable-next-line
interface String {
    StartsWith(inString: string): boolean;
    Hash(): number;
}

if (!String.prototype.StartsWith) {
    String.prototype.StartsWith = function(inString) {
        return this.slice(0, inString.length) === inString;
    };
}
