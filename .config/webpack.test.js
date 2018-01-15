const path = require("path");
const webpack = require("webpack");
const _ = require('lodash');
const glob = require('glob');

const wpPluginTsChecker = require('fork-ts-checker-webpack-plugin');
const wpKebabChunkRename = require('./plugin/kebab-chunk-rename');
const depModules = require('./plugin/dependant-modules');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    
    const lPathApp = ['.', 'modules', inArgs.appName].join('/');
    const lPathAppSource = ['.', 'modules', inArgs.appName, 'source'].join('/');
    
    // Get all modules that make up the application
    const lDepModules = depModules(inArgs.appName, '../..');

    // Get all spec files in the application & dep
    const lSpecFiles = {};
    [inArgs.appName, ...lDepModules].map( n => {
        const lFiles = glob.sync(['.', 'modules', n, 'source', '**', '*.spec.ts'].join('/'));
        if (lFiles && lFiles.length) {
            lSpecFiles[_.camelCase(n)+'Test'] = lFiles;
        }
    });
    
    const lWebpackSettings = {};

    // The base directory, an absolute path, for resolving entry points and loaders from configuration.
    lWebpackSettings.context = path.normalize(__dirname + '/..');

    // The point or points to enter the application. 
    lWebpackSettings.entry = lSpecFiles;
    
    lWebpackSettings.resolve = { 
        extensions: ['.ts', '.js'], // Extentions to try on import
        modules: ['node_modules'], // Import search paths
        alias: {} //Import to folder map
    };
    // Map libraries to their correct folder
    lDepModules.map(n => lWebpackSettings.resolve.alias[n] = path.resolve(__dirname, '..', 'modules', n, 'source'));


    // Resolve for Webpack Loaders
    lWebpackSettings.resolveLoader = {
        modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
     };


    lWebpackSettings.module = {
        loaders: [
            // Typescript
            { test: /\.ts$/, loader: 'ts-loader', include: [path.resolve(__dirname, '..', 'modules')], options: { transpileOnly: true } }
        ]
    };


    lWebpackSettings.output = {
        path: path.join(__dirname, '..', '_dist', 'test'),
        filename: "[name].js",
        library: "[name]"
    };


    lWebpackSettings.devtool = 'source-map';


    lWebpackSettings.plugins = [];

    lWebpackSettings.plugins.push(new wpKebabChunkRename());

    const lVendorPath = path.normalize(path.resolve(__dirname, '..', '_dist', 'js', inArgs.vendorPath));
    const lVendorScriptInclude = inArgs.vendorDlls.map(v => 'js/' + (inArgs.vendorPath) + v + '.dll.js');
    const lVendorDllPlugin = inArgs.vendorDlls.map(v => new webpack.DllReferencePlugin({ 
        manifest: require(path.resolve(lVendorPath, v + '.dll.json')) 
    }));
    Array.prototype.push.apply(lWebpackSettings.plugins, lVendorDllPlugin);
    
    /*for(let i=0; i<inArgs.libNames.length; i++ ) {
        const n = inArgs.libNames[i];
        lWebpackSettings.plugins.push( 
            new webpack.optimize.CommonsChunkPlugin({
                name: _.camelCase(n),
                minChunks: (m,c) => {
                    const lLibTest = inArgs.libNames.slice(i).map(n => new RegExp(`[/\\\\]${n}[/\\\\]`));
                    const lLibMatch = lLibTest.map( t => t.test(m.resource));
                    return _.some(lLibMatch);
                }
            }));
    }*/
    
    /*lWebpackSettings.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "webpack",
        minChunks: Infinity 
    }));*/
    
    if (lUglify) {
        lWebpackSettings.plugins.push(new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false }));
    }
    
    lWebpackSettings.plugins.push(
        new wpPluginTsChecker({
            tsconfig: path.resolve(lPathApp + '/tsconfig.json'),
            tslint: path.resolve(lPathApp + '/tslint.json'),
            diagnosticFormatter: "codeframe", 
            workers: 2
        })
    );
    
    
    return  lWebpackSettings;
}