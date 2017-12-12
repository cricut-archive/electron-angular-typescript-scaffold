import { bootstrap, IModule, module } from 'angular';
import { ngConfig } from './ng-config';
import { ngRun } from './ng-run';

export class ngModule {

    private static mInstance: ngModule;

    private mModule: IModule;
    private mConfig: ngConfig;
    private mRun: ngRun;

    public constructor() {
        this.mModule = module('appBasicTest', ['ui.router']);
        this.mConfig = new ngConfig(this.mModule);
        this.mRun = new ngRun(this.mModule);

        // TO TEST TRANSPILE SETTINGS
        // const array = [{} {}];
        // const x: number = '1';
    }

    /**
     * Returns the applications module handle, creating it if needed.
     */
    public static Get(): IModule {
        if (!ngModule.mInstance) {
            ngModule.mInstance = new ngModule();
        }

        return ngModule.mInstance.mModule;
    }

}
