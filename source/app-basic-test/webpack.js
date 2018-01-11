module.exports = module.exports = function(inArgs) {
    inArgs = inArgs || {};
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat

    inArgs.appName = 'app-basic-test';
    inArgs.libNames = ['lib-common'];

    inArgs.vendorPath = lConcat ? '' : 'vendor/';
    inArgs.vendorDlls = lConcat ? ['vendor'] : ['angular', 'bowser', 'lodash', 'typescript'];

    return require('../../.config/webpack.webapp')(inArgs);
}
