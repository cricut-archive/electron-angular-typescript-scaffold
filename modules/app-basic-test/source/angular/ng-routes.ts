
import { dirRouteHomeLanding } from '../route/home-landing/dir-route-home-landing';
import { dirRouteHome } from '../route/home/dir-route-home';

import {StateProvider, UrlRouterProvider} from '@uirouter/angularjs';

import * as _ from 'lodash';

export class ngRoutes {
    constructor(private $stateProvider: StateProvider,
                private $urlRouterProvider: UrlRouterProvider) {
        console.debug('ANGULAR: ngRoutes()');

        // SET DEFAULT ROUTE
        this.$urlRouterProvider.otherwise('/landing');

        $stateProvider.state('home', {
            url: '/home',
            views: {
                '': { template: `<${_.kebabCase(dirRouteHome.$tsName)} />` },
            },
        });
        $stateProvider.state('home.landing', {
            url: '^/landing',
            views: {
                '': { template: `<${_.kebabCase(dirRouteHomeLanding.$tsName)} />` },
            },
        });
    }

}
