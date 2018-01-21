const path = require("path");
const webpack = require('webpack');

module.exports = function(inArgs) {
  const lUglify = (inArgs && inArgs.uglify); //--env.uglify
  const lConcat = (inArgs && inArgs.concat); //--env.concat

  //LIST OF ALL POSSIBLE VENDOR INCLUDES
  let lVendorEntry = {
    'angular': ['angular', 'angular-cookies', '@uirouter/angularjs'],
    'bowser': ['bowser'],
    'lodash': ['lodash'],
    'typescript': ['tslib'],
    'fontAwesome': ['./node_modules/font-awesome/less/font-awesome.less'],
    'styleLoader': ['./node_modules/style-loader/lib/urls', './node_modules/style-loader/lib/addStyles', './node_modules/style-loader/lib/addStyleUrl' ],
    'cssLoader': ['./node_modules/css-loader/lib/css-base']
  };

  //FLATTEN LIST OUR FOR CONCAT FILE
  if (lConcat) {
    let lVendorEntryConcat = [];
    Object.keys(lVendorEntry).forEach(k => (lVendorEntryConcat = [...lVendorEntryConcat, ...lVendorEntry[k]]));
    lVendorEntry = { vendor: lVendorEntryConcat };
  }

  //ADD UGLIFY PLUGIN IF SET
  const lUglifyPlugin = lUglify ? [
    new webpack.optimize.UglifyJsPlugin({ beautify: false, comments: false })
  ] : [];

  const lConfig = {

    context: path.normalize(__dirname + '/..'),

    entry: lVendorEntry,

    devtool: 'source-map',

    module: {
      loaders: [
        { test: /\.less$/, loader: [
          { loader: "style-loader", options: { hmr: false, sourceMap: true } },
          { loader: "css-loader", options: { sourceMap: true } }, 
          { loader: "less-loader", options: { sourceMap: true } }],
        },
        { test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/, loader: "file-loader",
          options: { name:'../../fonts/vendor/[name].[ext]' } }  
      ]
    },

    output: {
      path: path.join(__dirname, '..', '_dist', 'js', lConcat ? '.' : 'vendor'),
      filename: '[name].dll.js',
      library: '[name]Dll', //NEEDS TO MATCH DllPlugin NAME
    },

    plugins: [

      ...lUglifyPlugin,

      new webpack.DllPlugin({
        path: path.resolve( '_dist', 'js', lConcat ? '.' : 'vendor', '[name].dll.json'),
        name: '[name]Dll'
      })
    ]
  }

  return lConfig;

}
