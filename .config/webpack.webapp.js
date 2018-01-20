const path = require("path");
const webpack = require("webpack");
const _ = require('lodash');

const wpPluginHtml = require('html-webpack-plugin');
const wpPluginTsChecker = require('fork-ts-checker-webpack-plugin');
const wpKebabChunkRename = require('./plugin/kebab-chunk-rename');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lTest = (inArgs && inArgs.test); //--env.test
    
    const lPathApp = ['.', 'modules', inArgs.appName].join('/');
    const lPathAppSource = ['.', 'modules', inArgs.appName, 'source'].join('/');


    const lWebpackSettings = {};


    // The base directory, an absolute path, for resolving entry points and loaders from configuration.
    lWebpackSettings.context = path.normalize(__dirname + '/..');

    // The point or points to enter the application. 
    lWebpackSettings.entry = {};
    lWebpackSettings.entry[_.camelCase(inArgs.appName)] = [lPathAppSource + "/index.ts"];
    
    lWebpackSettings.resolve = { 
        extensions: ['.ts', '.js'], // Extentions to try on import
        modules: ['node_modules'], // Import search paths
        alias: {} //Import to folder map
    };
    // Map libraries to their correct folder
    inArgs.libNames.map(n => lWebpackSettings.resolve.alias[n] = path.resolve(__dirname, '..', 'modules', n, 'source'));


    // Resolve for Webpack Loaders
    lWebpackSettings.resolveLoader = {
        modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
     };


    lWebpackSettings.module = {
        loaders: [
            { test: /^(?!.*\.spec\.ts$).*\.ts$/, loader: 'ts-loader', 
              include: [inArgs.appName, ...inArgs.libNames].map(p => path.resolve(__dirname, '..', 'modules', p)), 
              options: { transpileOnly: true } },             
            { test: /\.less$/, loader: [
                { loader: "style-loader", options: { hmr: false, sourceMap: true } },
                { loader: "css-loader", options: { sourceMap: true } }, 
                { loader: "less-loader", options: { sourceMap: true } }],
            },
            { test: /\.tmpl$/, loader: 'html-loader',              
              options: { attrs: false, exportAsDefault: true }                
            }     
        ]
    };


    lWebpackSettings.output = {
        path: path.join(__dirname, '..', '_dist', 'js'),
        filename: "[name].js",
        library: "[name]"
    };


    lWebpackSettings.devtool = 'source-map';


    lWebpackSettings.plugins = [];

    lWebpackSettings.plugins.push(new wpKebabChunkRename());

    lWebpackSettings.plugins.push(
        new wpPluginTsChecker({
            tsconfig: path.resolve(lPathApp + '/tsconfig.json'),
            tslint: path.resolve(lPathApp + '/tslint.json'),
            diagnosticFormatter: "codeframe", 
            workers: 2
        })
    );

    const lVendorPath = path.normalize(path.resolve(__dirname, '..', '_dist', 'js', inArgs.vendorPath));
    const lVendorScriptInclude = inArgs.vendorDlls.map(v => 'js/' + (inArgs.vendorPath) + v + '.dll.js');
    const lVendorDllPlugin = inArgs.vendorDlls.map(v => new webpack.DllReferencePlugin({ 
        manifest: require(path.resolve(lVendorPath, v + '.dll.json')) 
    }));
    Array.prototype.push.apply(lWebpackSettings.plugins, lVendorDllPlugin);
        
    if (lUglify) {
        lWebpackSettings.plugins.push(new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false, sourceMap: true }));
    }

    lWebpackSettings.plugins.push(
        new wpPluginHtml({
            title: 'Webpack Test App',
            filename: '../index.html',
            template: lPathAppSource + '/index.html',
            inject: false,
            jsVendor: lVendorScriptInclude,
            //cssVendor: ['style/vendor/vendor.css'],
            //css: [`style/${inArgs.appName}.css`]
        })
    );

    if (!lConcat) {
        const lChunkLibNames = [inArgs.appName, ...inArgs.libNames, 'node-modules'];
        const lChunkTests = [];
        for(let i=0; i<lChunkLibNames.length; i++ ) {
            lChunkTests[i] = [
                new RegExp(`.*[/\\\\]${lChunkLibNames[i]}[/\\\\].*`), new RegExp(`.*[/\\\\]${lChunkLibNames[i]}[/\\\\].*\.(tmpl|less)$`)
            ];
        }

        for(let i=0; i<lChunkLibNames.length; i++ ) {
            const n = lChunkLibNames[i];

            if (n !== inArgs.appName) {
                lWebpackSettings.plugins.push( 
                    new webpack.optimize.CommonsChunkPlugin({
                        name: _.camelCase(n),
                        minChunks: (m,c) => {
                            const lNextFolder = lChunkTests.slice(i).map(t => t[0].test(m.resource));
                            const lCurrentFolder = lNextFolder.shift();
                            const lCurrentAsset = lChunkTests.slice(i)[0][1].test(m.resource);

                            return _.some(lNextFolder) || (lCurrentFolder);
                        }
                    }));
            }

            lWebpackSettings.plugins.push( 
                new webpack.optimize.CommonsChunkPlugin({
                    name: _.camelCase(n)+'Asset',
                    minChunks: (m,c) => {
                        const lNextFolder = lChunkTests.slice(i).map(t => t[0].test(m.resource));
                        const lCurrentFolder = lNextFolder.shift();
                        const lCurrentAsset = lChunkTests.slice(i)[0][1].test(m.resource);

                        return lResult = _.some(lNextFolder) || (lCurrentFolder && lCurrentAsset);
                    }
                }));

        }
    }
    
    lWebpackSettings.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "webpack",
        minChunks: Infinity 
    }));
    
    
    return  lWebpackSettings;
}