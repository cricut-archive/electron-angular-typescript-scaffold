import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as _ from 'lodash';
import chalk from 'chalk';
import * as minimist from 'minimist';
import opn = require('opn');
import * as express from 'express';
import * as chokidar from 'chokidar';

const log: (message?: any, ...optionalParams: any[]) => void = console.log.bind(console);

function RunTerminal(inScript: string, inArgs: string[], inCWD: string, inCaptureOutput: boolean): Promise<string> {
    return new Promise((inResolve, inReject) => {
            console.log(chalk.yellow(`node ${inScript} ${inArgs.join(' ')}`));
            let lOutput:string = '';
            let lTerminal: child_process.ChildProcess = child_process.fork(inScript, inArgs, { silent: inCaptureOutput });
            if (inCaptureOutput) {
                lTerminal.stdout.on('data', (d: Buffer) => {
                    lOutput += d.toString();
                });
            }

            lTerminal.on('close', (inCode: number) => (inCode === 0) ? inResolve(lOutput): inReject());
    }); 
}

async function Clean(inArgs: minimist.ParsedArgs) {
    const lRimRafPath:string = './node_modules/rimraf/bin.js';
    await RunTerminal(lRimRafPath, ['_dist/*'], '.', false);   
}

async function Build(inArgs: minimist.ParsedArgs) {
    const lWebpackPath:string = './node_modules/webpack/bin/webpack.js';

    for(let i=0; i < inArgs._.length; i++) {
        const lTarget = inArgs._[i];
        const lWebPackArgs: string[] = [
                '--config', 
                (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./modules/${lTarget}/webpack.js`,
                ... inArgs.v? ['--verbose'] : [],
                ... inArgs.r? ['--env.concat', '--env.uglify'] : [],
                '--bail', '--colors'];  
        
        await RunTerminal(lWebpackPath, lWebPackArgs, '.', false); 
    }
}

async function Watch(inArgs: minimist.ParsedArgs) {
    
    const lWatchers: chokidar.FSWatcher[] = [];
    const lBuildTargets: string[] = [];
    let lBuilding: boolean = false;

    const lBuildTarget = (inFromComplete: boolean) => {
        if (!inFromComplete && lBuilding) return;
        lBuilding = true;

        const lTarget = lBuildTargets.shift();
        if (!lTarget) {
            lBuilding = false;
            return;
        }
        
        _.pull(lBuildTargets, lTarget);
        const lArgs = _.cloneDeep(inArgs);
        lArgs._ = [lTarget];
        console.log(`BUILDING: [${lTarget}]`);
        Build(lArgs).then( 
            () => lBuildTarget(true), 
            () => {
                lBuilding = false;
                console.log(`BUILDING: [${lTarget}] Failed`); 
            } );
    };
    const lBuildTargetDB = _.debounce(lBuildTarget, 2000);

    for(let i=0; i < inArgs._.length; i++) {
        const lTarget = inArgs._[i];
        if (lTarget === 'vendor') continue;

        const lDepModules = await GetDependantModules(lTarget);
        console.log(`WATCHING:\t[${lTarget}] <= [${lDepModules.join('], [')}]`);
        const lDepModulesPath = lDepModules.map(p => `modules/${p}`);

        const lWatcher = chokidar.watch([`modules/${lTarget}`, ...lDepModulesPath], {ignored: /(^|[/\\\\])\../});
        lWatcher.on('raw', (inEvent, inPath, inDetails) => {
            console.log(`CHANGE:\t[${lTarget}]\t[${chalk.yellow(inEvent)}]\t'${chalk.yellow(inPath)}'`);
            lBuildTargets.push(lTarget);
            lBuildTargetDB(false);
        });

        lWatchers.push(lWatcher);
    }
 
    //LOCK FUNCTION
    await new Promise(()=>{});
}

async function GetDependantModules(inModule:string): Promise<string[]> {
    const lModuleList: string[] = [];

    let lConfig = require(`../modules/${inModule}/tsconfig.json`);
    const lPaths = lConfig && lConfig.compilerOptions && lConfig.compilerOptions.paths;
    const lModuleNames = Object.keys(lPaths||{}).map( k => k.substr(0, k.indexOf('/')));

    Array.prototype.push.apply(lModuleList, lModuleNames);
    for(let i:number = 0; i < lModuleNames.length; i++) {
        const lDepModules = await GetDependantModules(lModuleNames[i]);
        Array.prototype.push.apply(lModuleList, lDepModules);
    }

    return _.uniq(lModuleList);
}

async function Serve(inArgs: minimist.ParsedArgs) {
    await Build(inArgs);
    Watch(inArgs);

    return new Promise<void>((inResolve, inReject) => {
        const lExpress = express();

        lExpress.use((req, res, next) => {
            res.on('finish', ()=>{
                const lDate = new Date();
                const lDateStr = `${lDate.getHours()}:${lDate.getMinutes()}:${lDate.getSeconds()}`;
                const lStatus = ((res.statusCode < 300) && chalk.green(String(res.statusCode)))
                                || ((res.statusCode < 400) && chalk.cyan(String(res.statusCode)))
                                || chalk.red(String(res.statusCode));
                console.log(`${lDateStr} ${lStatus} ${chalk.green(req.method)} ${chalk.yellow(req.url)}`);
            });
            next();
        });
        lExpress.use(express.static(path.join(__dirname, '..', '_dist')));
    
        const lServer = lExpress.listen(9000, 'design-local.cricut.com', function () {
            console.log(`Listening http://${lServer.address().address}:${lServer.address().port}`);
            opn('http://design-local.cricut.com:9000');
        });
        
    });
}

async function Profile(inArgs: minimist.ParsedArgs) {
    const lWebpackPath:string = './node_modules/webpack/bin/webpack.js';
    const lWebpackAnalyzer:string = './node_modules/webpack-bundle-analyzer/lib/bin/analyzer.js';
    const lTarget = inArgs._[0];

    const lWebPackArgs: string[] = [ 
        '--config', (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./modules/${lTarget}/webpack.js`, 
        '--profile', 
        '--json' ];

    let lProfileData = await RunTerminal(lWebpackPath, lWebPackArgs, '.', true);
    lProfileData = lProfileData.substr(lProfileData.indexOf('{', 0));
    
    fs.writeFileSync(`./_dist/${lTarget}.json`, lProfileData);

    opn('http://webpack.github.com/analyse');
    await RunTerminal(lWebpackAnalyzer, [`./_dist/${lTarget}.json`], '.', false);
}


// WRAP MAIN IN ASYNC TO KICK OFF AWAIT CHAIN
async function _main() {
    try {
        const lArgv = minimist(process.argv.slice(2), {
            string: [ 'command', 'environment' ],
            alias: { c: 'command', r: 'release', e: 'environment', v: 'verbose' },
            default: { release: false }
          });
        lArgv.v && console.log(lArgv);
        lArgv.v && console.log('');

        console.log(chalk.green(`COMMAND\t\t[${chalk.yellow(lArgv.c)}]`));
        lArgv.e && console.log(chalk.green(`ENVIRONMENT\t[${chalk.yellow(lArgv.e)}]`));
        console.log(chalk.green(`RELEASE\t\t[${chalk.yellow(lArgv.r)}]`));
        lArgv._.length && console.log(chalk.green(`TARGET(S)\t[${chalk.yellow(lArgv._.join(', '))}]`));
        console.log('');
        
        if (lArgv.c === 'clean') await Clean(lArgv);
        else if (lArgv.c === 'build') await Build(lArgv);
        else if (lArgv.c === 'watch') await Watch(lArgv);
        else if (lArgv.c === 'serve') await Serve(lArgv);
        else if (lArgv.c === 'profile') await Profile(lArgv);
        
        console.log(``);
        process.exitCode = 0;
    } catch (inErr) {
        if (inErr instanceof Error) {
            console.log(`ERROR: ${inErr.message}`);
            console.log(inErr.stack);
        } else {
            console.log('ERROR:\n' + JSON.stringify(inErr, null, 4));
        }

        process.exit(-1);
    }
}

_main();
