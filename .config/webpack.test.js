const webpack = require("webpack");
const _ = require('lodash');
const glob = require('glob');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat

    const lWebpackSettings = require('./webpack.webapp')(inArgs);

    lWebpackSettings.entry['karmaTests'] = glob.sync('./modules/**/*.spec.ts');
    lWebpackSettings.module.loaders[0].test = /.*\.ts$/;

    lWebpackSettings.plugins.splice(inArgs.vendorDlls.length + 2);

    for(let i=0; i<inArgs.libNames.length; i++ ) {
        const n = inArgs.libNames[i];

        const lIsMatch = (res, sp) => {
            const lLibTest = inArgs.libNames.slice(i).map(n => new RegExp(`[/\\\\]${n}[/\\\\]`));
            const lLibMatch = lLibTest.map( t => t.test(res));
            const lSpecFile = /.*\.spec\.ts$/.test(res);
            return sp ? (lLibMatch[0] && lSpecFile) || _.some(lLibMatch.slice(1)) : _.some(lLibMatch);
        };

        lWebpackSettings.plugins.push( 
            new webpack.optimize.CommonsChunkPlugin({
                name: _.camelCase(n),
                minChunks: (m,c) => lIsMatch(m.resource, false)
            }));
        
        lWebpackSettings.plugins.push( 
            new webpack.optimize.CommonsChunkPlugin({
                name: _.camelCase(n+'Spec'),
                minChunks: (m,c) => lIsMatch(m.resource, true)
            }));
    }
    
    lWebpackSettings.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "webpack",
        minChunks: Infinity 
    }));

    
    return  lWebpackSettings;
}