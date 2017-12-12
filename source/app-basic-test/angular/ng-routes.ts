import {StateProvider, UrlRouterProvider} from '@uirouter/angularjs';

export class ngRoutes {
    constructor(private readonly mModuleName: string,
                private $stateProvider: StateProvider,
                private $urlRouterProvider: UrlRouterProvider) {
        // SET DEFAULT ROUTE
        this.$urlRouterProvider.otherwise('/landing');

        $stateProvider.state('home', { url: '/home' });
        $stateProvider.state('home.landing', {
            url: '^/landing',
            views: {
                '': this.ViewBuilder('HomeLanding', this.mModuleName, true),
                'sidebar-left@home': {},
                'sidebar-right@home': {},
                'footer@home': {},
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

        lView.templateUrl = `${lModuleName}/${lTmplFolder}/${lViewDash}/tmpl-${lViewDash}.html`;
        lView.controller = `ctrl${inViewName}`;
        lView.controllerAs = `ctrl${inViewName}`;

        return lView;
    }
}
