const path = require("path");
const _ = require("lodash");

var dtsBundler = ( () => {
    function dtsBundler(options) {
        options = options || {};
        this.filename = options.filename || '';
    }

    dtsBundler.prototype.apply = function (compiler) {
        const _this = this;

        compiler.plugin('emit', function (compilation, callback) {

            const declarationFiles = {};
            for (let filename in compilation.assets) {
                if (filename.indexOf('.d.ts') !== -1) {
                    declarationFiles[filename] = compilation.assets[filename];
                    delete compilation.assets[filename];
                }
            }

            //combine them into one declaration file
            var combinedDeclaration = _this.generateCombinedDeclaration(declarationFiles);

            //and insert that back into the assets
            compilation.assets[_this.filename] = {
                source: function () {
                    return combinedDeclaration;
                },
                size: function () {
                    return combinedDeclaration.length;
                }
            };

            //webpack may continue now
            callback();
        });

    }

    dtsBundler.prototype.generateCombinedDeclaration = function (declarationFiles) {
        let lReference = [];
        let lImport = [];
        let lDefinition = [];

        for (var fileName in declarationFiles) {
            var declarationFile = declarationFiles[fileName];
            var data = declarationFile.source();
            var lines = data.split('\n');

            lDefinition.push('\n/// BEGIN: ' + fileName);
            for (let i = 0; i < lines.length; i++) {
                if (/^\/\/\/ <reference types=/.test(lines[i])) {
                    lReference.push(lines[i]);
                } else if (/^import /.test(lines[i])) {
                    lImport.push(lines[i]);
                } else if (/export \* from/.test(lines[i])) {
                    continue;
                } else {
                    lDefinition.push(lines[i]);
                }
            }
            lDefinition.push('/// END: ' + fileName);
        }

        lImport = _.orderBy(_.uniq(lImport));
        lImport = _.filter(lImport, (l) => !/'\..*'/.test(l));
       
        return lImport.join('\n') + '\n\n' + lDefinition.join('\n');
    }

    return dtsBundler;
})();
module.exports = dtsBundler;