const path = require("path");
const webpack = require("webpack");

const webpackPluginHtml = require('html-webpack-plugin');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    
    const lAppPath = ['.', 'source', inArgs.appName].join('/');
    
    const lVendorPath = path.normalize(path.resolve(__dirname, '..', 'dist', 'js', inArgs.vendorPath));
    const lVendorDllPlugin = inArgs.vendorDlls.map(v => new webpack.DllReferencePlugin({ manifest: require(path.resolve(lVendorPath, v +'.dll.json')) }));
    const lVendorScriptInclude = inArgs.vendorDlls.map(v => 'js/' + (inArgs.vendorPath) + v + '.dll.js');

    //ADD UGLIFY PLUGIN IF SET
    const lUglifyPlugin = lUglify ? [
        new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false })
    ] : [];

    return  {

        context: path.normalize(__dirname + '/..'),

        entry: {
            'app': [lAppPath + "/index.ts"]
        },
        
        resolve: { 
            extensions: ['.ts', '.js']
        },
        resolveLoader: {
            modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
         },
        
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader', include: [path.resolve(__dirname, '..', 'source')] }, //TS COMPILE
                { test: /ng-templates.ts$/, loader: 'ng-template', include: [path.resolve(__dirname, '..', 'source')] } //ANGULA TEMPLATES
            ]
            /*,
            rules: [
                { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader',
                  options: { }
                }
            ]*/
        },

        output: {
            path: path.join(__dirname, '..', 'dist', 'js'),
            filename: "[name].js",
            library: "[name]"
        },

        devtool: 'source-map',

        plugins: [

            ...lVendorDllPlugin,

            ...lUglifyPlugin,

            new webpackPluginHtml({
                title: 'Webpack Test App',
                filename: '../index.html',
                template: lAppPath + '/index.html',
                inject: false,
                vendor: lVendorScriptInclude
            })
        
        ]
    };
}