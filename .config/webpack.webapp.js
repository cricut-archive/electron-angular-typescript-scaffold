const path = require("path");
const webpack = require("webpack");
const _ = require('lodash');

const webpackPluginHtml = require('html-webpack-plugin');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    
    const lAppPath = ['.', 'source', inArgs.appName].join('/');
    
    const lEntry = {};
    lEntry[_.camelCase(inArgs.appName)] = [lAppPath + "/index.ts"];
    
    const lVendorPath = path.normalize(path.resolve(__dirname, '..', 'dist', 'js', inArgs.vendorPath));
    const lVendorDllPlugin = inArgs.vendorDlls.map(v => new webpack.DllReferencePlugin({ 
        manifest: require(path.resolve(lVendorPath, v +'.dll.json')) 
    }));
    const lVendorScriptInclude = inArgs.vendorDlls.map(v => 'js/' + (inArgs.vendorPath) + v + '.dll.js');

    const lLibraryPath = path.normalize(path.resolve(__dirname, '..', 'dist', 'js'));
    const lLibraryDllPlugin = inArgs.libraryDlls.map(v => new webpack.DllReferencePlugin({ 
        manifest: require(path.resolve(lLibraryPath, v +'.dll.json')),
        //scope: v
    }));
    const lLibraryScriptInclude = inArgs.libraryDlls.map(v => 'js/' + v + '.dll.js');
    
    const lAlias = {};
    //inArgs.libraryDlls.map(v => lAlias[v] = path.resolve(__dirname, '..', 'dist', 'js', v + '.dll.js'));
    //console.log(lAlias);

    //ADD UGLIFY PLUGIN IF SET
    const lUglifyPlugin = lUglify ? [
        new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false })
    ] : [];

    return  {

        context: path.normalize(__dirname + '/..'),
        
        entry: lEntry,
        
        resolve: { 
            extensions: ['.ts', '.js'],
            modules: ['node_modules', path.join(__dirname, '..', 'source')]
        },
        
        resolveLoader: {
            modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
         },
        
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader', include: [path.resolve(__dirname, '..', 'source')], 
                  options: { transpileOnly: true } }, //TS COMPILE
                { test: /ng-templates.ts$/, loader: 'ng-template', include: [path.resolve(__dirname, '..', 'source')] } //ANGULA TEMPLATES
            ]
        },

        output: {
            path: path.join(__dirname, '..', 'dist', 'js'),
            filename: inArgs.appName + ".js",
            library: "[name]"
        },

        devtool: 'source-map',

        plugins: [

            ...lVendorDllPlugin,

            ...lLibraryDllPlugin,

            ...lUglifyPlugin,

            new webpackPluginHtml({
                title: 'Webpack Test App',
                filename: '../index.html',
                template: lAppPath + '/index.html',
                inject: false,
                vendor: lVendorScriptInclude,
                library: lLibraryScriptInclude
            })
        
        ]
    };
}