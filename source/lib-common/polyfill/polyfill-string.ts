interface String {
    startsWith(inString: string): boolean;
    toHash(): number;
    concatList(inString: string): string;
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(inString) {
        return this.slice(0, inString.length) === inString;
    };
}

if (!String.prototype.toHash) {
    String.prototype.toHash = function(): number {
        var hash: number = 0, i: number, chr: string, len: number;
        if (this.length === 0) {
            return hash;
        }
        for (i = 0, len = this.length; i < len; i++) {
            chr = this.charCodeAt(i).toString();
            hash = (((hash << 5) - hash) + chr) as any;
            hash |= 0;  // Convert to 32bit integer
        }
        return hash;
    };
}

if (!String.prototype.concatList) {
    String.prototype.concatList = function(inString) {
        let self = this.length ? this.concat(' and ') : this;
        return self.concat(inString);
    };
}
