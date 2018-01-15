import {StateProvider, UrlRouterProvider} from '@uirouter/angularjs';

export class ngRoutes {
    constructor(private readonly mModuleName: string,
                private $stateProvider: StateProvider,
                private $urlRouterProvider: UrlRouterProvider) {
        console.debug('ANGULAR: ngRoutes()');

        // SET DEFAULT ROUTE
        this.$urlRouterProvider.otherwise('/landing');

        $stateProvider.state('home', {
            url: '/home',
            views: {
                '': this.ViewBuilder('Home', this.mModuleName, true),
            },
        });
        $stateProvider.state('home.landing', {
            url: '^/landing',
            views: {
                '': this.ViewBuilder('HomeLanding', this.mModuleName, true),
            },
        });
    }

    private ViewBuilder(inViewName: string, inModuleName: string, inIsRoute?: boolean) {
        inIsRoute = inIsRoute || false;

        const lView: any = {};
        const lTmplFolder: string = (inIsRoute ? 'route' : 'view');
        const lViewDash: string = inViewName.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
        const lModuleName: string = inModuleName.replace(/\W+/g, '-')
                                                .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();

        lView.templateUrl = `${lModuleName}/source/${lTmplFolder}/${lViewDash}/tmpl-${lViewDash}.html`;
        lView.controller = `ctrl${inViewName}`;
        lView.controllerAs = `ctrl${inViewName}`;

        return lView;
    }
}
