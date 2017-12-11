const glob = require("glob");
const jsesc = require('jsesc');
var fs = require('fs');

function AngularHtmlTemplateToCache(inOptions) {
  // Setup the plugin instance with options...
  this.mOptions = inOptions;
  console.log('::INIT', inOptions);
}

AngularHtmlTemplateToCache.prototype.readFile = function(inPath) {
  return new Promise((inResolve, inReject) => {
    fs.readFile(inPath, 'utf8', (inErr, inData) => {
      if (inErr) {
        inReject(inErr);
      } else {
        inData = inData.replace(/^\uFEFF/, '');  // REMOVE BOM
        inData = jsesc(inData);
        
        inResolve({path: inPath, data: inData});
      }
        
    });
  });
}

AngularHtmlTemplateToCache.prototype.apply = function(inCompiler) {
  const _this = this;

  inCompiler.plugin("compile", function(inParams) {
    console.log("::COMPILE");
  });

  inCompiler.plugin("compilation", function(inCompilation) {
    console.log("::COMPILATION");

    inCompilation.plugin("optimize", function() {
      console.log("::OPTIMIZE");
    });
  });

  inCompiler.plugin('emit', function(inCompilation, inCallback) {
    console.log('::EMIT');

    const lTemplates = glob.sync('./**/tmpl*.html');

    const lTemplateRead = lTemplates.map(t => _this.readFile(t));

    Promise.all(lTemplateRead).then((inTemplates)=>{
      let lTemplateFileSource = '';
      {
        let lTemplateLines = [];
        inTemplates.map(t => lTemplateLines.push(`$templateCache.put('${t.path}', '${t.data}');`));
        lTemplateFileSource = lTemplateLines.join('\n');
      }

      inCompilation.assets['templates.js'] = {
        source: function() {
          return lTemplateFileSource;
        },
        size: function() {
          return lTemplateFileSource.length;
        }
      };

      inCallback();

    }, ()=>{

      inCompilation.errors.push( new Error( 'Error reading template data files.' ) );
      inCallback();
    });


  });

  inCompiler.plugin('done', function() {
    console.log('::DONE');
  });
};

module.exports = AngularHtmlTemplateToCache;