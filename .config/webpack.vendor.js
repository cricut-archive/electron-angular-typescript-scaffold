const path = require("path");
const webpack = require('webpack');

module.exports = function(inArgs) {
  const lUglify = (inArgs && inArgs.uglify); //--env.uglify
  const lConcat = (inArgs && inArgs.concat); //--env.concat

  //LIST OF ALL POSSIBLE VENDOR INCLUDES
  let lVendorEntry = {
    'angular': ['angular', 'angular-cookies', '@uirouter/angularjs'],
    'bowser': ['bowser'],
    'lodash': ['lodash']
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

    output: {
      path: path.join(__dirname, '..', 'dist', 'js', lConcat ? '.' : 'vendor'),
      filename: '[name].dll.js',
      library: '[name]Dll', //NEEDS TO MATCH DllPlugin NAME
    },

    plugins: [

      ...lUglifyPlugin,

      new webpack.DllPlugin({
        path: path.resolve( 'dist', 'js', lConcat ? '.' : 'vendor', '[name].dll.json'),
        name: '[name]Dll'
      })
    ]
  }

  return lConfig;

}
