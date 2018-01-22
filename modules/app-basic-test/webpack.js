module.exports = function(inArgs) {
    inArgs = inArgs || {};
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lTest = (inArgs && inArgs.test); //--env.test
    const lVendor = (inArgs && inArgs.vendor); //--env.vendor

    const lConfig = require('../../.config/webpack.combined');

    inArgs.appName = 'app-basic-test';
    inArgs.appEntry = ['./modules/app-basic-test/source/index.ts'];

    inArgs.libNames = ['lib-common', 'lib-common2'];

    inArgs.vendorEntry = {
        'angular': ['angular', 'angular-cookies', '@uirouter/angularjs'],
        'angularBootstrap': ['angular-ui-bootstrap', './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'],
        'bootstrap': ['./node_modules/bootstrap/less/bootstrap.less'],
        'bowser': ['bowser'],
        'lodash': ['lodash'],
        'typescript': ['tslib'],
        'fontAwesome': ['./node_modules/font-awesome/less/font-awesome.less'],
        'styleLoader': ['./node_modules/style-loader/lib/urls', './node_modules/style-loader/lib/addStyles', './node_modules/style-loader/lib/addStyleUrl' ],
        'cssLoader': ['./node_modules/css-loader/lib/css-base']
    };

    return lConfig({...inArgs});
    
}
