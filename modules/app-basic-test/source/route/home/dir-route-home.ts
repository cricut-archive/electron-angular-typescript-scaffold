import {
    IAttributes,
    IAugmentedJQuery,
    IDirective,
    IDirectiveFactory,
    ILogService
} from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { ctrlRouteHome } from './ctrl-route-home';

import './route-home.less';
import tmplRouteHome from './route-home.tmpl';

export class dirRouteHome implements IDirective {
    public static $tsName: string = ngRegister.Add(
        dirRouteHome,
        'dirRouteHome',
        ['$log'],
        ngModule.Get()
    );

    // DIRECTIVE SETUP
    public restrict: string = 'E';
    public require: string[] = [];
    public controller: string = ctrlRouteHome.$tsName;
    public controllerAs: string = ctrlRouteHome.$tsName;
    public template: string = tmplRouteHome;
    public bindToController: boolean = true;

    constructor(private $log: ILogService) {
        // NO OP
    }

    public static getDirective(): IDirectiveFactory {
        return ($log: ILogService) => new dirRouteHome($log);
    }
}
