const _ = require('lodash');

function GetDependantModules(inModule, inModulePath) {
    
        const lModuleList = [];
        let lConfig = require(`${inModulePath}/modules/${inModule}/tsconfig.json`);
        const lPaths = lConfig && lConfig.compilerOptions && lConfig.compilerOptions.paths;
        const lModuleNames = Object.keys(lPaths || {}).map(k => k.substr(0, k.indexOf('/')));
        Array.prototype.push.apply(lModuleList, lModuleNames);
        for (let i = 0; i < lModuleNames.length; i++) {
            const lDepModules = GetDependantModules(lModuleNames[i], inModulePath);
            Array.prototype.push.apply(lModuleList, lDepModules);
        }
        
        return _.uniq(lModuleList);
    
}

module.exports = GetDependantModules;