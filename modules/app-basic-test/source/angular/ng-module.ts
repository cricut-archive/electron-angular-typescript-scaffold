import { IModule, module } from 'angular';

import '../index.less';

export class ngModule {
    private static mModule: IModule = ngModule.mModule = module('appBasicTest', ['ui.router']);

    public static Get(): IModule {
        return this.mModule;
    }

}
