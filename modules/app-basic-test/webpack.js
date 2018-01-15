module.exports = function(inArgs) {
    inArgs = inArgs || {};
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat
    const lTest = (inArgs && inArgs.test); //--env.test

    inArgs.appName = 'app-basic-test';
    
    inArgs.vendorPath = lConcat ? '' : 'vendor/';
    inArgs.vendorDlls = lConcat ? ['vendor'] : ['angular', 'bowser', 'lodash', 'typescript'];

    inArgs.libNames = ['lib-common', 'lib-common2'];

    if (lTest) {
        return require('../../.config/webpack.test')(inArgs);
    } else {
        return require('../../.config/webpack.webapp')(inArgs);
    }
    
}
