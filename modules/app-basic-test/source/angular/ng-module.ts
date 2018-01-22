import { IModule, module } from 'angular';

import '@uirouter/angularjs';
import 'angular-ui-bootstrap';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls';

import '../index.less';

export class ngModule {
    private static mModule: IModule = ngModule.mModule = module('appBasicTest', ['ui.router', 'ui.bootstrap']);

    public static Get(): IModule {
        return this.mModule;
    }

}
