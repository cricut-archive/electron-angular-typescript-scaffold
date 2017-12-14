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
class IBuildParams {
}
class Builder {
    Main(inArgv) {
        return __awaiter(this, void 0, void 0, function* () {
            const lParams = this.ParseParams(inArgv);
            if (lParams.IsVerbose) {
                console.log(lParams);
            }
            if (lParams.Action === 'clean') {
                yield this.DoClean(lParams);
            }
            else if (lParams.Action === 'build') {
                yield this.DoBuildVendor(lParams, false);
            }
            else if (lParams.Action === 'rebuild') {
                yield this.DoClean(lParams);
                yield this.DoBuildVendor(lParams, true);
            }
            return 0;
        });
    }
    ParseParams(inArgv) {
        const lBuildParams = {};
        lBuildParams.NodePath = inArgv[0];
        lBuildParams.BuilderPath = inArgv[1];
        lBuildParams.IsDebug = true;
        if (['build', 'rebuild', 'clean'].indexOf(inArgv[2]) > -1) {
            lBuildParams.Action = inArgv[2];
        }
        else {
            throw new Error('INVALID BUILD ACTION');
        }
        // DEFAULTS
        lBuildParams.Env = '';
        for (let lArgvAt = 3; lArgvAt < inArgv.length; lArgvAt++) {
            if ((inArgv[lArgvAt] === '-t') || (inArgv[lArgvAt] === '--target')) {
                lArgvAt++;
                lBuildParams.Target = inArgv[lArgvAt].toUpperCase();
            }
            else if ((inArgv[lArgvAt] === '-v') || (inArgv[lArgvAt] === '--verbose')) {
                lBuildParams.IsVerbose = true;
            }
            else if ((inArgv[lArgvAt] === '-r') || (inArgv[lArgvAt] === '--release')) {
                lBuildParams.IsDebug = false;
            }
            else if (inArgv[lArgvAt] === '--colors') {
                // IGNORE - COLOR FLAG PASS THROUGH
            }
            else if (inArgv[lArgvAt] === '--env') {
                lArgvAt++;
                lBuildParams.Env = inArgv[lArgvAt].toUpperCase();
            }
            else {
                throw new Error(`INVALID BUILD PARAM: ${inArgv[lArgvAt]}`);
            }
        }
        return lBuildParams;
    }
    DoClean(inParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const lRimRafPath = path.resolve(__dirname, '../node_modules/rimraf/bin.js');
            yield this.RunExec('node', [lRimRafPath, 'dist/*'], '.');
        });
    }
    DoBuildVendor(inParams, inForceBuild) {
        return __awaiter(this, void 0, void 0, function* () {
            const lWebpackPath = path.resolve(__dirname, '../node_modules/webpack/bin/webpack.js');
            const lCheckPath = `./dist/js/vendor${inParams.IsDebug ? '' : '.dll.js'}`;
            let lShouldBuild = true;
            if (!inForceBuild) {
                lShouldBuild = !(yield this.FileExists(lCheckPath));
                if (inParams.IsVerbose) {
                    console.log(`${lCheckPath} EXISTS: ${!lShouldBuild}`);
                }
            }
            if (lShouldBuild) {
                const lParams = [
                    '--config', './.config/webpack.vendor.js',
                    ...inParams.IsVerbose ? ['--verbose'] : [],
                    ...inParams.IsDebug ? [] : ['--env.concat', '--env.uglify'],
                    '--bail', '--colors'
                ];
                yield this.RunExec('node', [lWebpackPath, ...lParams], '.');
            }
        });
    }
    RunExec(inPath, inArgs, inCWD, inValidExitCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            inValidExitCodes = inValidExitCodes || [0];
            yield new Promise((inResolve, inReject) => {
                console.log('RUNNING EXEC: ' + (inPath) + ' ' + (inArgs.join(' ')) + ' @' + (inCWD));
                const lProcess = child_process.spawn(inPath, inArgs, { cwd: inCWD, shell: true });
                lProcess.stdout.on('data', (inData) => {
                    _.filter(inData.toString().split(/\n|\r/), (l) => {
                        return (l.length > 0);
                    }).forEach(lLine => {
                        console.log(lLine);
                    });
                });
                lProcess.on('message', (inData) => {
                    console.log(inData);
                });
                lProcess.on('exit', (inCode) => {
                    const lExitOK = _.indexOf(inValidExitCodes, inCode) >= 0;
                    console.log('EXEC: ' + inPath + ' ' + inArgs.join(' ') + ' EXIT: ' + (inCode.toString()));
                    if (lExitOK) {
                        inResolve();
                    }
                    else {
                        inReject(inCode);
                    }
                });
                lProcess.on('error', (inCode, inSignal) => {
                    console.log('EXEC ERROR: ' + inPath + ' EXIT: ' + (inCode.toString()));
                    console.log(`${inCode}, ${inSignal}`);
                    inReject(inCode);
                });
            });
        });
    }
    FileExists(inPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((inResolve) => {
                fs.access(inPath, fs.constants.R_OK, (inErr) => {
                    inResolve(inErr ? false : true);
                });
            });
        });
    }
}
// WRAP MAIN IN ASYNC TO KICK OFF AWAIT CHAIN
function _main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lBuilder = new Builder();
            const lExitCode = yield lBuilder.Main(process.argv);
            console.log(``);
            process.exitCode = lExitCode;
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
