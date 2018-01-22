const webpack = require("webpack");

const wpPluginHtml = require('html-webpack-plugin');
const wpPluginTsChecker = require('fork-ts-checker-webpack-plugin');
const wpKebabChunkRename = require('./plugin/kebab-chunk-rename');

const path = require("path");

const _ = require('lodash');
const glob = require('glob');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lTest = (inArgs && inArgs.test); //--env.test
    const lVendor = (inArgs && inArgs.vendor); //--env.vendor

    if (lConcat) {
        let lVendorEntry = [];
        Object.keys(inArgs.vendorEntry).forEach(k => (lVendorEntry = [...lVendorEntry, ...inArgs.vendorEntry[k]]));
        inArgs.vendorEntry = {vendor: lVendorEntry};
    }

    const lConfig = {};
    lConfig.context = path.normalize(__dirname + '/..');
    lConfig.devtool = 'source-map';

    //ENTRY
    {
        lConfig.entry = {};
        if (lVendor) {
            lConfig.entry = inArgs.vendorEntry;
        } else if (lTest) {
            lConfig.entry['karmaTests'] = glob.sync('./modules/**/*.spec.ts');
        } else {
            lConfig.entry[_.camelCase(inArgs.appName)] = ['.', 'modules', inArgs.appName, 'source', 'index.ts'].join('/');
        }
    }

    //MODULE
    {
        lConfig.module = {};

        //LOADERS
        {
            lConfig.module.loaders = [];
            !lVendor && (lConfig.module.loaders.push(
                { test: lTest ? /.*\.ts$/ : /^(?!.*\.spec\.ts$).*\.ts$/, loader: 'ts-loader', 
                  include: [inArgs.appName, ...inArgs.libNames].map(p => path.resolve(__dirname, '..', 'modules', p)), 
                  options: { transpileOnly: true } }
            ));
            !lVendor && (lConfig.module.loaders.push(
                { test: /\.tmpl$/, loader: 'html-loader',              
                  options: { attrs: false, exportAsDefault: true } }
            ));
            lConfig.module.loaders.push(
                { test: /\.less$/, loader: [
                    { loader: "style-loader", options: { hmr: false, sourceMap: true } },
                    { loader: "css-loader", options: { sourceMap: true } }, 
                    { loader: "less-loader", options: { sourceMap: true } }] }               
            );
            lConfig.module.loaders.push(
                { test: /\.scss$/, loader: [
                    { loader: "style-loader", options: { hmr: false, sourceMap: true } },
                    { loader: "css-loader", options: { sourceMap: true } }, 
                    { loader: "sass-loader", options: { sourceMap: true } }] }               
            );
            lConfig.module.loaders.push(
                { test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/, loader: "file-loader",
                  options: { name: (lConcat ? '../' : '../../') + 'fonts/[name].[ext]' } } 
            );
        }
    }

    //RESOLVE
    {
        (!lVendor) && (lConfig.resolve = { 
            extensions: ['.ts', '.js'], // Extentions to try on import
            modules: ['node_modules'], // Import search paths
            alias: {} //Import to folder map
        });

        (!lVendor) && inArgs.libNames.map(
            n => lConfig.resolve.alias[n] = path.resolve(__dirname, '..', 'modules', n, 'source'));
    }

    //RESOLVE LOADER
    {
        (!lVendor) && (lConfig.resolveLoader = {
            modules: ['node_modules', path.join(__dirname, 'plugin')] //LOAD OUR CUSTOM LOADERS
        });
    }

    //PLUGINS
    {
        lConfig.plugins = [];

        lUglify && (lConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false, sourceMap: true })));

        lVendor && (lConfig.plugins.push(
            new webpack.DllPlugin({
                path: path.resolve( '_dist', 'js', lConcat ? '.' : 'vendor', '[name].dll.json'),
                name: '[name]Dll'
            })
        ));

        if (!lVendor) {
            const lVendorPath = path.normalize( path.resolve(__dirname, '..', '_dist', 'js', (lConcat ? '' : 'vendor')) );
            const lVendorDlls = Object.keys(inArgs.vendorEntry);
            const lVendorDllPlugin = lVendorDlls.map(v => new webpack.DllReferencePlugin({ 
                manifest: require(path.resolve(lVendorPath, v + '.dll.json')) 
            }));
            Array.prototype.push.apply(lConfig.plugins, lVendorDllPlugin);
        }

        (!lVendor) && (lConfig.plugins.push( new wpKebabChunkRename() ));

        (!lVendor) && (lConfig.plugins.push(
            new wpPluginTsChecker({
                tsconfig: path.resolve(['.', 'modules', inArgs.appName, 'tsconfig.json'].join('/')),
                tslint: path.resolve(['.', 'modules', inArgs.appName, 'tslint.json'].join('/') ),
                diagnosticFormatter: "codeframe", 
                workers: 2
            })
        ));

        (!lVendor) && (!lTest) && (lConfig.plugins.push(
            new wpPluginHtml({
                title: 'Webpack Test App',
                filename: '../index.html',
                template: ['.', 'modules', inArgs.appName, 'source', 'index.html'].join('/'),
                inject: false,
                jsVendor: Object.keys(inArgs.vendorEntry).map(v => 'js/' + (lConcat ? '' : 'vendor/') + v + '.dll.js'),
                //cssVendor: ['style/vendor/vendor.css'],
                //css: [`style/${inArgs.appName}.css`]
            })
        ));

        if ((!lVendor)&&(!lTest)&&(!lConcat)) {

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
                    lConfig.plugins.push( 
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
    
                lConfig.plugins.push( 
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

    }

    //OUTPUT
    {
        lConfig.output = {};
        if (lVendor) {
            lConfig.output.path = path.join(__dirname, '..', '_dist', 'js', lConcat ? '.' : 'vendor');
            lConfig.output.filename = '[name].dll.js';
            lConfig.output.library = '[name]Dll';
        } else if (lTest) {
            lConfig.output.path = path.join(__dirname, '..', '_dist', 'js');
            lConfig.output.filename = '[name].test.js';
            lConfig.output.library = '[name]';
        } else {
            lConfig.output.path = path.join(__dirname, '..', '_dist', 'js');
            lConfig.output.filename = '[name].js';
            lConfig.output.library = '[name]';
        }
    }

    //FINAL CONFIG
    return lConfig;

};