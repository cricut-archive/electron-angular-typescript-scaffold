module.exports = function(inArgs) {
    inArgs = inArgs || {};
    inArgs.target = 'electron-main';

    const lConfig = require('../../.config/webpack.combined');

    inArgs.appName = 'app-basic-test-electron';
    inArgs.appEntry = ['./modules/app-basic-test-electron/source/main.ts'];
    inArgs.libNames = [];

    inArgs.vendorEntry = {
        'lodash': ['lodash'],
    };

    return lConfig({...inArgs});
    
}
