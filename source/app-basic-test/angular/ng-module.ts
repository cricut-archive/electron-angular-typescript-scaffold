import { IModule, module, bootstrap } from "angular";
import { ngConfig } from './ng-config';
import { ngRun } from './ng-run';

export class ngModule {

    private mModule: IModule;
    private mConfig: ngConfig;
    private mRun: ngRun;
    
    public constructor() {
        this.mModule = module('appBasicTest', ['ui.router']);
        this.mConfig = new ngConfig(this.mModule);
        this.mRun = new ngRun(this.mModule);
    }

    //APP MODULE SINGLETON
    private static mInstance: ngModule;
    public static Get(): IModule {
        if (!ngModule.mInstance) {
            ngModule.mInstance = new ngModule();
        }

        return ngModule.mInstance.mModule;
    }
    
}

