module.exports = module.exports = function(inArgs) {
    inArgs = inArgs || {};
    const lUglify = (inArgs && inArgs.uglify); //--env.uglify
    const lConcat = (inArgs && inArgs.concat); //--env.concat

    inArgs.appName = 'lib-common';

    inArgs.vendorPath = lConcat ? '' : 'vendor/';
    inArgs.vendorDlls = lConcat ? ['vendor'] : ['lodash', 'typescript'];

    return require('../../.config/webpack.library')(inArgs);
}
