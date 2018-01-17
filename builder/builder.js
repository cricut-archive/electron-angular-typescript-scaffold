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
const path = require("path");
const child_process = require("child_process");
const fs = require("fs");
const _ = require("lodash");
const chalk_1 = require("chalk");
const minimist = require("minimist");
const opn = require("opn");
const express = require("express");
const chokidar = require("chokidar");
const log = console.log.bind(console);
function RunTerminal(inScript, inArgs, inCWD, inCaptureOutput) {
    return new Promise((inResolve, inReject) => {
        console.log(chalk_1.default.yellow(`node ${inScript} ${inArgs.join(' ')}`));
        let lOutput = '';
        let lTerminal = child_process.fork(inScript, inArgs, { silent: inCaptureOutput });
        if (inCaptureOutput) {
            lTerminal.stdout.on('data', (d) => {
                lOutput += d.toString();
            });
        }
        lTerminal.on('close', (inCode) => (inCode === 0) ? inResolve(lOutput) : inReject());
    });
}
function Clean(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lRimRafPath = './node_modules/rimraf/bin.js';
        yield RunTerminal(lRimRafPath, ['_dist/*'], '.', false);
    });
}
function Build(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWebpackPath = './node_modules/webpack/bin/webpack.js';
        for (let i = 0; i < inArgs._.length; i++) {
            const lTarget = inArgs._[i];
            const lWebPackArgs = [
                '--config',
                (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./modules/${lTarget}/webpack.js`,
                ...inArgs.v ? ['--verbose'] : [],
                ...inArgs.r ? ['--env.concat', '--env.uglify'] : [],
                '--bail', '--colors'
            ];
            yield RunTerminal(lWebpackPath, lWebPackArgs, '.', false);
        }
    });
}
function Watch(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWatchers = [];
        const lBuildTargets = [];
        let lBuilding = false;
        const lBuildTarget = (inFromComplete) => {
            if (!inFromComplete && lBuilding)
                return;
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
            Build(lArgs).then(() => lBuildTarget(true), () => {
                lBuilding = false;
                console.log(`BUILDING: [${lTarget}] Failed`);
            });
        };
        const lBuildTargetDB = _.debounce(lBuildTarget, 2000);
        for (let i = 0; i < inArgs._.length; i++) {
            const lTarget = inArgs._[i];
            if (lTarget === 'vendor')
                continue;
            const lDepModules = require('../.config/plugin/dependant-modules.js')(lTarget, '../..');
            console.log(`WATCHING:\t[${lTarget}] <= [${lDepModules.join('], [')}]`);
            const lDepModulesPath = lDepModules.map(p => `modules/${p}`);
            const lWatcher = chokidar.watch([`modules/${lTarget}`, ...lDepModulesPath], { ignored: /(^|[/\\\\])\../ });
            lWatcher.on('raw', (inEvent, inPath, inDetails) => {
                console.log(`CHANGE:\t[${lTarget}]\t[${chalk_1.default.yellow(inEvent)}]\t'${chalk_1.default.yellow(inPath)}'`);
                lBuildTargets.push(lTarget);
                lBuildTargetDB(false);
            });
            lWatchers.push(lWatcher);
        }
        //LOCK FUNCTION
        yield new Promise(() => { });
    });
}
function Serve(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Build(inArgs);
        Watch(inArgs);
        return new Promise((inResolve, inReject) => {
            const lExpress = express();
            lExpress.use((req, res, next) => {
                res.on('finish', () => {
                    const lDate = new Date();
                    const lDateStr = `${lDate.getHours()}:${lDate.getMinutes()}:${lDate.getSeconds()}`;
                    const lStatus = ((res.statusCode < 300) && chalk_1.default.green(String(res.statusCode)))
                        || ((res.statusCode < 400) && chalk_1.default.cyan(String(res.statusCode)))
                        || chalk_1.default.red(String(res.statusCode));
                    console.log(`${lDateStr} ${lStatus} ${chalk_1.default.green(req.method)} ${chalk_1.default.yellow(req.url)}`);
                });
                next();
            });
            lExpress.use(express.static(path.join(__dirname, '..', '_dist')));
            const lServer = lExpress.listen(9000, 'design-local.cricut.com', function () {
                console.log(`Listening http://${lServer.address().address}:${lServer.address().port}`);
                opn('http://design-local.cricut.com:9000');
            });
        });
    });
}
function Test(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWebpackPath = './node_modules/webpack/bin/webpack.js';
        const lKarmaPath = './node_modules/karma/bin/karma';
        const lTarget = inArgs._[0];
        const lWebPackArgs = [
            '--config',
            `./modules/${lTarget}/webpack.js`,
            ...inArgs.v ? ['--verbose'] : [],
            ...inArgs.r ? ['--env.concat', '--env.uglify'] : [],
            '--env.test',
            '--bail', '--colors'
        ];
        yield RunTerminal(lWebpackPath, lWebPackArgs, '.', false);
        yield RunTerminal(lKarmaPath, ['start', './.config/karma.config.js'], '.', false);
    });
}
function Profile(inArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const lWebpackPath = './node_modules/webpack/bin/webpack.js';
        const lWebpackAnalyzer = './node_modules/webpack-bundle-analyzer/lib/bin/analyzer.js';
        const lTarget = inArgs._[0];
        const lWebPackArgs = [
            '--config', (lTarget === 'vendor') ? './.config/webpack.vendor.js' : `./modules/${lTarget}/webpack.js`,
            '--profile',
            '--json'
        ];
        let lProfileData = yield RunTerminal(lWebpackPath, lWebPackArgs, '.', true);
        lProfileData = lProfileData.substr(lProfileData.indexOf('{', 0));
        fs.writeFileSync(`./_dist/${lTarget}.json`, lProfileData);
        opn('http://webpack.github.com/analyse');
        yield RunTerminal(lWebpackAnalyzer, [`./_dist/${lTarget}.json`], '.', false);
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
            else if (lArgv.c === 'watch')
                yield Watch(lArgv);
            else if (lArgv.c === 'serve')
                yield Serve(lArgv);
            else if (lArgv.c === 'test')
                yield Test(lArgv);
            else if (lArgv.c === 'profile')
                yield Profile(lArgv);
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
