import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as _ from 'lodash';
import chalk from 'chalk';
import * as minimist from 'minimist';

function RunTerminal(inScript: string, inArgs: string[], inCWD: string) {
    return new Promise((inResolve, inReject) => {
            console.log(chalk.yellow(`node ${inScript} ${inArgs.join(' ')}`));
            let lTerminal: child_process.ChildProcess = child_process.fork(inScript, inArgs);
            lTerminal.on('close', (inCode: number) => (inCode === 0) ? inResolve(): inReject());
    }); 
}

async function Clean(inArgs: minimist.ParsedArgs) {
    const lRimRafPath:string = './node_modules/rimraf/bin.js';
    await RunTerminal(lRimRafPath, ['dist/*'], '.');   
}

async function Build(inArgs: minimist.ParsedArgs) {
    const lWebpackPath:string = './node_modules/webpack/bin/webpack.js';

    for(let i=0; i < inArgs._.length; i++) {
        const lTarget = inArgs._[i];
        const lWebPackArgs: string[] = [
                '--config', 
                (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./source/${lTarget}/webpack.js`,
                ... inArgs.v? ['--verbose'] : [],
                ... inArgs.r? ['--env.concat', '--env.uglify'] : [],
                '--bail', '--colors'];  
        
        await RunTerminal(lWebpackPath, lWebPackArgs, '.'); 
    }
}

async function Serve(inArgs: minimist.ParsedArgs) {
    const lWebpackServerPath:string = './node_modules/webpack-dev-server/bin/webpack-dev-server.js';
    const lTarget = inArgs._[0];
    const lWebPackArgs: string[] = [
        `--config ./source/${lTarget}/webpack.js`, 
        ... inArgs.v? ['--verbose'] : [],
        ... inArgs.r? ['--env.concat', '--env.uglify'] : [],
        `--host design-local.cricut.com`, 
        `--content-base ./dist`,  
        `--open`
    ];

    await RunTerminal(lWebpackServerPath, lWebPackArgs, '.');
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
        else if (lArgv.c === 'serve') await Serve(lArgv);
        
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
