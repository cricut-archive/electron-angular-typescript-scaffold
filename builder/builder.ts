import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as _ from 'lodash';

class IBuildParams {
    NodePath: string;
    BuilderPath: string;
    
    Action: BuildAction;
    Target: string;

    Env: string;

    IsDebug: boolean;

    IsVerbose: boolean;
}

enum BuildAction {
    BUILD,
    REBUILD,
    CLEAN
}

class Builder {
   
    public async Main(inArgv: string[]): Promise<number> {
        const lParams = this.ParseParams(inArgv);
        
        if (lParams.IsVerbose) {
            console.log(lParams);
        }

        if (lParams.Action === BuildAction.CLEAN) {
            await this.DoClean(lParams);
        } else if (lParams.Action === BuildAction.BUILD) {
            await this.DoBuildVendor(lParams, false);
        } else if (lParams.Action === BuildAction.REBUILD) {
            await this.DoClean(lParams);
            await this.DoBuildVendor(lParams, true);
        }


        return 0;
    }

    private ParseParams(inArgv: string[]): IBuildParams {
        const lBuildParams: IBuildParams = {} as IBuildParams;

        lBuildParams.NodePath = inArgv[0];
        lBuildParams.BuilderPath = inArgv[1];
        lBuildParams.IsDebug = true;


        lBuildParams.Action = this.SwitchEnumValueType(BuildAction, inArgv[2].toUpperCase());
        if (!lBuildParams.Action) {
            throw new Error('INVALID BUILD ACTION');
        }

        // DEFAULTS
        lBuildParams.Env = '';

        for (let lArgvAt = 3; lArgvAt < inArgv.length; lArgvAt++) {
            if ((inArgv[lArgvAt] === '-t') || (inArgv[lArgvAt] === '--target')) {
                lArgvAt++;
                lBuildParams.Target = inArgv[lArgvAt].toUpperCase();
            } else if ((inArgv[lArgvAt] === '-v') || (inArgv[lArgvAt] === '--verbose')) {
                lBuildParams.IsVerbose = true;
            } else if ((inArgv[lArgvAt] === '-r') || (inArgv[lArgvAt] === '--release')) {
                lBuildParams.IsDebug = false;
            } else if (inArgv[lArgvAt] === '--colors') {
                // IGNORE - COLOR FLAG PASS THROUGH
            } else if (inArgv[lArgvAt] === '--env') {
                lArgvAt++;
                lBuildParams.Env = inArgv[lArgvAt].toUpperCase();
            } else {
                throw new Error(`INVALID BUILD PARAM: ${inArgv[lArgvAt]}`);
            }
        }

        return lBuildParams;
    }

    private async DoClean(inParams: IBuildParams): Promise<void> {
        const lRimRafPath:string = path.resolve(__dirname, '../node_modules/rimraf/bin.js');
        await this.RunExec('node', [lRimRafPath, 'dist/*'], '.');
    }

    private async DoBuildVendor(inParams: IBuildParams, inForceBuild: boolean): Promise<void> {
        const lWebpackPath:string = path.resolve(__dirname, '../node_modules/webpack/bin/webpack.js');
        const lCheckPath:string = `./dist/js/vendor${ inParams.IsDebug? '': '.dll.js'}`;

        let lShouldBuild: boolean = true;
        if (!inForceBuild) {
            lShouldBuild = !(await this.FileExists(lCheckPath));
            if (inParams.IsVerbose) {
                console.log(`${lCheckPath} EXISTS: ${!lShouldBuild}`);
            }
        }

        if (lShouldBuild) {
            const lParams: string[] = [
                '--config', './.config/webpack.vendor.js',
                ... inParams.IsVerbose? ['--verbose'] : [],
                ... inParams.IsDebug? [] : ['--env.concat', '--env.uglify'],
                '--bail', '--colors'];

            await this.RunExec('node', [lWebpackPath, ...lParams], '.');
        }
    }

    public async RunExec(inPath: string, inArgs: string[], inCWD: string, inValidExitCodes?: number[]): Promise<void> {
        inValidExitCodes = inValidExitCodes || [0];

        await new Promise<void>((inResolve, inReject) => {
            
            console.log('RUNNING EXEC: ' + (inPath) + ' ' + (inArgs.join(' ')) + ' @' + (inCWD));
            
            const lProcess = child_process.spawn(inPath, inArgs, {cwd: inCWD, shell: true});

            lProcess.stdout.on('data', (inData: string) => {
                _.filter(inData.toString().split(/\n|\r/), (l) => {
                    return (l.length > 0);
                }).forEach(lLine => {
                    console.log(lLine);
                });
            });

            lProcess.on('message', (inData: string) => {
                console.log(inData);
            });

            lProcess.on('exit', (inCode: number) => {
                const lExitOK = _.indexOf(inValidExitCodes, inCode) >= 0;
                console.log('EXEC: ' + inPath + ' ' + inArgs.join(' ') + ' EXIT: ' + (inCode.toString()));

                if (lExitOK) {
                    inResolve();
                } else {
                    inReject(inCode);
                }
            });

            lProcess.on('error', (inCode: number, inSignal: string) => {
                console.log('EXEC ERROR: ' + inPath + ' EXIT: ' + (inCode.toString()));
                console.log(`${inCode}, ${inSignal}`);
                inReject(inCode);
            });

        });
    }

    private async FileExists(inPath: string): Promise<boolean> {
        return new Promise<boolean>((inResolve) => {
            fs.access(inPath, fs.constants.R_OK, (inErr: NodeJS.ErrnoException) => {
                inResolve(inErr ? false : true);
            });
        });
    }

    private SwitchEnumValueType(e: any, v: string | number): any {
        if (_.isString(v)) {
            v = v.toUpperCase();
        }
        
        return e[v];
    }

}





// WRAP MAIN IN ASYNC TO KICK OFF AWAIT CHAIN
async function _main() {
    try {
        const lBuilder = new Builder();
        const lExitCode = await lBuilder.Main(process.argv);
        console.log(``);
        process.exitCode = lExitCode;
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
