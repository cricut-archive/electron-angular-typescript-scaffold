
import { dirRouteHome } from '../route/home/dir-route-home';
import { dirRouteHomeLanding } from '../route/home-landing/dir-route-home-landing';
import { dirRouteHomeBootstrap } from '../route/home-bootstrap/dir-route-home-bootstrap';
import { dirRouteHomeFontAwesome } from '../route/home-font-awesome/dir-route-home-font-awesome';
import { dirRouteNavigation } from '../route/navigatin/dir-route-navigation';

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
                'navigation': { template: `<${_.kebabCase(dirRouteNavigation.$tsName)} />` },
            },
        });

        $stateProvider.state('home.landing', {
            url: '^/landing',
            views: {
                '': { template: `<${_.kebabCase(dirRouteHomeLanding.$tsName)} />` },
            },
        });

        $stateProvider.state('home.font-awesome', {
            url: '^/font-awesome',
            views: {
                '': { template: `<${_.kebabCase(dirRouteHomeFontAwesome.$tsName)} />` },
            },
        });

        $stateProvider.state('home.bootstrap', {
            url: '^/bootstrap',
            views: {
                '': { template: `<${_.kebabCase(dirRouteHomeBootstrap.$tsName)} />` },
            },
        });

    }

}
