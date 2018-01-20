import { StateProvider, UrlRouterProvider } from '@uirouter/angularjs';
import { IModule } from 'angular';
import { ngRoutes } from './ng-routes';

import '@uirouter/angularjs';

export class ngConfig {
    private mRoutes: ngRoutes;

    constructor(inModule: IModule) {
        inModule.config(['$stateProvider', '$urlRouterProvider',
            ($stateProvider: StateProvider, $urlRouterProvider: UrlRouterProvider) => {
                console.debug(`ANGULAR ${inModule.name}: ngConfig()`);

                // REGISTER ALL ROUTES
                this.mRoutes = new ngRoutes($stateProvider, $urlRouterProvider);
             },
            ]);
        }
}
