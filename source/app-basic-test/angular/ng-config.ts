import { ngRoutes } from './ng-routes';
import { UrlRouterProvider, StateProvider } from '@uirouter/angularjs';
import { IModule } from 'angular';

import '@uirouter/angularjs';

export class ngConfig {
    private mRoutes: ngRoutes;

    constructor(inModule: IModule) {
        inModule.config(['$stateProvider', '$urlRouterProvider',
            ($stateProvider: StateProvider, $urlRouterProvider: UrlRouterProvider) => {
                // REGISTER ALL ROUTES
                this.mRoutes = new ngRoutes(inModule.name, $stateProvider, $urlRouterProvider);
             }
            ]);
        }
}
