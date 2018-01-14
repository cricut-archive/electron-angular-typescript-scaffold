const path = require("path");
const webpack = require("webpack");
const _ = require('lodash');

const webpackPluginHtml = require('html-webpack-plugin');
const dtsBundler = require('./plugin/dts-bundler');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    
    const lAppPath = ['.', 'source', inArgs.appName].join('/');
    
    const lEntry = {};
    lEntry[_.camelCase(inArgs.appName)] = [lAppPath + "/index.ts"];
    
    const lVendorPath = path.normalize(path.resolve(__dirname, '..', 'dist', 'js', inArgs.vendorPath));
    const lVendorDllPlugin = inArgs.vendorDlls.map(v => new webpack.DllReferencePlugin({ manifest: require(path.resolve(lVendorPath, v +'.dll.json')) }));
    const lVendorScriptInclude = inArgs.vendorDlls.map(v => 'js/' + (inArgs.vendorPath) + v + '.dll.js');

    //ADD UGLIFY PLUGIN IF SET
    const lUglifyPlugin = lUglify ? [
        new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false })
    ] : [];

    return  {

        context: path.normalize(__dirname + '/..'),
        
        entry: lEntry,
        
        resolve: { 
            extensions: ['.ts', '.js']
        },
        
        resolveLoader: {
            modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
         },
        
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader', include: [path.resolve(__dirname, '..', 'source')], 
                  options: { transpileOnly: false } }, //TS COMPILE
                { test: /ng-templates.ts$/, loader: 'ng-template', include: [path.resolve(__dirname, '..', 'source')] } //ANGULA TEMPLATES
            ]
        },

        output: {
            path: path.join(__dirname, '..', 'dist', 'js'),
            filename: inArgs.appName + ".dll.js",
            library: "[name]Dll"
        },

        devtool: 'source-map',

        plugins: [

            ...lVendorDllPlugin,

            ...lUglifyPlugin,

            new dtsBundler({
                filename: inArgs.appName + '.d.ts'
            }),

            new webpack.DllPlugin({
                path: path.resolve( 'dist', 'js', inArgs.appName + '.dll.json'),
                name: '[name]Dll'
            })
        
        ]
    };
}