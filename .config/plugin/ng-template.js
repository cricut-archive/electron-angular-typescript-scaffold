const path = require("path");
const glob = require("glob");
const jsesc = require('jsesc');
var fs = require('fs');

module.exports = function(inSource) {
    this.cacheable();
    var lCallback = this.async();

    function ReadFile(inPath) {
        return new Promise((inResolve, inReject) => {
          fs.readFile(inPath, 'utf8', (inErr, inData) => {
            if (inErr) {
              inReject(inErr);
            } else {
              inData = inData.replace(/^\uFEFF/, '');  // REMOVE BOM
              inData = jsesc(inData);
              
              inResolve({Path: inPath, Data: inData});
            } 
          });
        });
    }

    glob('./**/tmpl*.html', (inErr, inFiles)=>{
        if (inErr) {
            return lCallback(inErr);
        } else {
            const lFileReadPromise = inFiles.map(f => ReadFile(f));
            Promise.all(lFileReadPromise).then( (inTemplateData) => {

                let lTemplateLines = [];
                inTemplateData.map(t => lTemplateLines.push(JSON.stringify(t)));
                
                inSource = inSource.replace(/^.*@@AUTO GENERATED TEMPLATES/m, lTemplateLines.join(',\n'));

                lCallback(null, inSource);
                

            }, (inErr)=>{
                return lCallback(inErr);
            });
        }
    });

};