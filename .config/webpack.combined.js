const webpack = require("webpack");

const wpPluginHtml = require('html-webpack-plugin');
const wpPluginTsChecker = require('fork-ts-checker-webpack-plugin');
const wpKebabChunkRename = require('./plugin/kebab-chunk-rename');
const wpPrettier = require('prettier-webpack-plugin');
//const wpWebpackConstName = require('./plugin/webpack-const-name-plugin');

const path = require("path");

const _ = require('lodash');
const glob = require('glob');

module.exports = function(inArgs) {
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lVendor = (inArgs && inArgs.vendor); //--env.vendor
    const lElectron = (inArgs && (inArgs.target === 'electron-main'));

    if (lConcat) {
        let lVendorEntry = [];
        Object.keys(inArgs.vendorEntry).forEach(k => (lVendorEntry = [...lVendorEntry, ...inArgs.vendorEntry[k]]));
        inArgs.vendorEntry = {vendor: lVendorEntry};
    }

    const lConfig = {};
    lConfig.context = path.normalize(__dirname + '/..');
    lConfig.devtool = 'source-map';
    inArgs.target && (lConfig.target = inArgs.target);

    if (lElectron) {
        lConfig.node = { __dirname: false, __filename: false }
    }

    //ENTRY
    {
        lConfig.entry = {};
        if (lVendor) {
            lConfig.entry = inArgs.vendorEntry;
        } else {
            lConfig.entry[_.camelCase(inArgs.appName)] = inArgs.appEntry;
        }
    }

    //MODULE
    {
        lConfig.module = {};

        //LOADERS
        {
            lConfig.module.loaders = [];
            !lVendor && (lConfig.module.loaders.push(
                { test: /^(?!.*\.spec\.ts$).*\.ts$/, loader: 'ts-loader', 
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
                { test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/, loader: "file-loader",
                  options: { name: '/../../fonts/[name].[ext]',
                  publicPath: function(inPath) { return inPath.replace('/../..', './'); } }  
                } 
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

        (!lVendor) && (!lUglify) && (!lConcat) && lConfig.plugins.push(
            new wpPrettier({
                tabWidth: 4,
                useTabs: true,
                singleQuote: true,
                trailingComma: "none",
                bracketSpacing: true,
                arrowParens: "always"
              })
        );

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

        //(lNode) && (lConfig.plugins.push( new wpWebpackConstName() ));

        (!lVendor) && (lConfig.plugins.push(
            new wpPluginTsChecker({
                tsconfig: path.resolve(['.', 'modules', inArgs.appName, 'tsconfig.json'].join('/')),
                tslint: path.resolve(['.', 'modules', inArgs.appName, 'tslint.json'].join('/') ),
                diagnosticFormatter: "codeframe", 
                workers: 2
            })
        ));

        ((!lVendor) && (!lElectron)) && (lConfig.plugins.push(
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

        if ((!lVendor) && (!lElectron) && (!lConcat)) {

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
        } else if (lElectron) {
            lConfig.output.path = path.join(__dirname, '..', '_dist');
            lConfig.output.filename = '[name].js';
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