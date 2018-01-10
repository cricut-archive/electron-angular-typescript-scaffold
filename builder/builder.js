"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const chalk_1 = require("chalk");
const minimist = require("minimist");
function RunTerminal(inScript, inArgs, inCWD) {
    return new Promise((inResolve, inReject) => {
        console.log(chalk_1.default.yellow(`node ${inScript} ${inArgs.join(' ')}`));
        let lTerminal = child_process.fork(inScript, inArgs);
        lTerminal.on('close', (inCode) => (inCode === 0) ? inResolve() : inReject());
    });
}
function Clean(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lRimRafPath = './node_modules/rimraf/bin.js';
        yield RunTerminal(lRimRafPath, ['dist/*'], '.');
    });
}
function Build(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWebpackPath = './node_modules/webpack/bin/webpack.js';
        for (let i = 0; i < inArgs._.length; i++) {
            const lTarget = inArgs._[i];
            const lWebPackArgs = [
                '--config',
                (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./source/${lTarget}/webpack.js`,
                ...inArgs.v ? ['--verbose'] : [],
                ...inArgs.r ? ['--env.concat', '--env.uglify'] : [],
                '--bail', '--colors'
            ];
            yield RunTerminal(lWebpackPath, lWebPackArgs, '.');
        }
    });
}
function Serve(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWebpackServerPath = './node_modules/webpack-dev-server/bin/webpack-dev-server.js';
        const lTarget = inArgs._[0];
        const lWebPackArgs = [
            `--config ./source/${lTarget}/webpack.js`,
            ...inArgs.v ? ['--verbose'] : [],
            ...inArgs.r ? ['--env.concat', '--env.uglify'] : [],
            `--host design-local.cricut.com`,
            `--content-base ./dist`,
            `--open`
        ];
        yield RunTerminal(lWebpackServerPath, lWebPackArgs, '.');
    });
}
// WRAP MAIN IN ASYNC TO KICK OFF AWAIT CHAIN
function _main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lArgv = minimist(process.argv.slice(2), {
                string: ['command', 'environment'],
                alias: { c: 'command', r: 'release', e: 'environment', v: 'verbose' },
                default: { release: false }
            });
            lArgv.v && console.log(lArgv);
            lArgv.v && console.log('');
            console.log(chalk_1.default.green(`COMMAND\t\t[${chalk_1.default.yellow(lArgv.c)}]`));
            lArgv.e && console.log(chalk_1.default.green(`ENVIRONMENT\t[${chalk_1.default.yellow(lArgv.e)}]`));
            console.log(chalk_1.default.green(`RELEASE\t\t[${chalk_1.default.yellow(lArgv.r)}]`));
            lArgv._.length && console.log(chalk_1.default.green(`TARGET(S)\t[${chalk_1.default.yellow(lArgv._.join(', '))}]`));
            console.log('');
            if (lArgv.c === 'clean')
                yield Clean(lArgv);
            else if (lArgv.c === 'build')
                yield Build(lArgv);
            else if (lArgv.c === 'serve')
                yield Serve(lArgv);
            console.log(``);
            process.exitCode = 0;
        }
        catch (inErr) {
            if (inErr instanceof Error) {
                console.log(`ERROR: ${inErr.message}`);
                console.log(inErr.stack);
            }
            else {
                console.log('ERROR:\n' + JSON.stringify(inErr, null, 4));
            }
            process.exit(-1);
        }
    });
}
_main();
