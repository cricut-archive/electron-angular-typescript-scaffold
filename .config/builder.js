const fs = require("fs");
const path = require("path");
const process = require("process");
const child_process = require("child_process");

const _ = require("lodash");

const BUILD_ACTIONS = ['CLEAN'];

function Clean() {
	runExec('node',  )
}

function ParseParams(inArgv) {
	const lBuildParams = {};
	lBuildParams.Paths = {
		NodePath: inArgv[0],
		WorkingDir: process.cwd(),
		WebpackPath: path.resolve(__dirname, "../node_modules/webpack/bin/webpack.js"),
		RimrafPath: path.resolve(__dirname, '../node_modules/rimraf/bin.js')
	}

	// DEFAULTS
	lBuildParams.Env = '';

	for (let lArgvAt = 2; lArgvAt < inArgv.length; lArgvAt++) {
		if ((inArgv[lArgvAt] === '-a') || (inArgv[lArgvAt] === '--action')) {
			lArgvAt++;
			lBuildParams.Action = inArgv[lArgvAt].toUpperCase();
			if (_.indexOf(BUILD_ACTIONS, lBuildParams.Action) === -1) {
				throw new Error(`INVALID BUILD ACTION: ${lBuildParams.Action}`);
			}
		} else if (inArgv[lArgvAt] === '--verbose') {
			lBuildParams.IsVerbose = true;
		} else if ((inArgv[lArgvAt] === '-e') || (inArgv[lArgvAt] === '--env')) {
			lArgvAt++;
			lBuildParams.Env = inArgv[lArgvAt].toUpperCase();
		} else {
			throw new Error(`INVALID PARAM: ${inArgv[lArgvAt]}`);
		}
	}

	if (!lBuildParams.Action) {
		throw new Error(`BUILD ACTION REQUIRED:\nnpm run build -a (${BUILD_ACTIONS.join(', ')})`);
	}

	return lBuildParams;
}

function RunExec(inPath, inArgs, inCWD, inValidExitCodes) {
	return new Promise((inResolve, inReject) => {
		inValidExitCodes = inValidExitCodes || [0];
		const lProcess = child_process.spawn(inPath, inArgs, {cwd: inCWD, shell: true});

		lProcess.on('error', (inCode, inSignal) => {
			console.log('EXEC ERROR: ' + inPath + ' EXIT: ' + inCode.toString());
			inReject(inCode);
		});

		lProcess.on('message', (inData) => console.log(inData));

		lProcess.stdout.on('data', (inData) => {
			_.filter(inData.toString().split(/\n|\r/), (l) => {
				 return (l.length > 0);
			 }).forEach(lLine => {
				console.log(lLine);
			});
		});

		lProcess.on('exit', (inCode) => {
			const lExitOK = _.indexOf(inValidExitCodes, inCode) >= 0;
			console.log('');
			console.log('EXEC: ' + inPath + ' ' + inArgs.join(' ') + ' EXIT: ' + inCode.toString());

			if (lExitOK) {
				inResolve();
			} else {
				inReject(inCode);
			}
		});

	});
}

const BUILD_PARAMS = ParseParams(process.argv);
console.log('BUILD:\n', JSON.stringify(BUILD_PARAMS, undefined, 4));

const lBuildTasks = [];
if (BUILD_PARAMS.Action == "CLEAN") {
	const lCleanTask = RunExec('node', [BUILD_PARAMS.Paths.RimrafPath, 'dist/*'], '.');
	lBuildTasks.push(lCleanTask);
}

Promise.all(lBuildTasks).then( 
	()=> process.exit(0), 

	()=> process.exit(-1));
