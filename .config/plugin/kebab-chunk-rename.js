
//rename output webpack plugin
class kebabChunkRename {

    constructor(options) {
        
    }

    apply(compiler) {

        compiler.plugin('this-compilation', (compilation) => {

            compilation.plugin(['optimize-chunks'], (chunks) => {

                chunks.forEach((chunk) => {

                    const lGetName = (inName) => {
                        let lNameSplit = inName.split('.');
                        const lNameExt = lNameSplit.length > 1 ? lNameSplit.pop() : 'js';
                        lNameSplit = lNameSplit.map( n => n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() );
                        lNameSplit.push(lNameExt);
                        return lNameSplit.join('.');
                    };


                    if (!chunk.filenameTemplate) {
                        const lNewTemplateName = lGetName(chunk.name);
                        console.log(`Setting chunk "${chunk.name}" to filename "${lNewTemplateName}"`);
                        chunk.filenameTemplate = lNewTemplateName;
                    } else if (chunk.filenameTemplate !== lGetName(chunk.filenameTemplate)) {
                        const lNewTemplateName = lGetName(chunk.filenameTemplate);
                        console.log(`Resetting chunk "${chunk.name}" from "${chunk.filenameTemplate}" to filename "${lNewTemplateName}"`);
                        chunk.filenameTemplate = lNewTemplateName;
                    }
                     
                });
            });
        });
    }
}

module.exports = kebabChunkRename;