module.exports = function(inArgs) {
    inArgs = inArgs || {};
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lTest = (inArgs && inArgs.test); //--env.test
    const lVendor = (inArgs && inArgs.vendor); //--env.vendor

    const lConfig = require('../../.config/webpack.combined');

    inArgs.appName = 'app-basic-test-electron';
    inArgs.libNames = [];

    inArgs.vendorEntry = {
        'lodash': ['lodash'],
    };

    return lConfig({...inArgs});
    
}
