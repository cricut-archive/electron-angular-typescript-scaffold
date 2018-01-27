import {
    IAttributes,
    IAugmentedJQuery,
    IDirective,
    IDirectiveFactory,
    ILogService
} from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { ctrlRouteHomeBootstrap } from './ctrl-route-home-bootstrap';

import tmplRouteHomeBootstrap from './route-home-bootstrap.tmpl';

export class dirRouteHomeBootstrap implements IDirective {
    public static $tsName: string = ngRegister.Add(
        dirRouteHomeBootstrap,
        'dirRouteHomeBootstrap',
        ['$log'],
        ngModule.Get()
    );

    // DIRECTIVE SETUP
    public restrict: string = 'E';
    public require: string[] = [];
    public controller: string = ctrlRouteHomeBootstrap.$tsName;
    public controllerAs: string = ctrlRouteHomeBootstrap.$tsName;
    public template: string = tmplRouteHomeBootstrap;
    public bindToController: boolean = true;

    constructor(private $log: ILogService) {
        // NO OP
    }

    public static getDirective(): IDirectiveFactory {
        return ($log: ILogService) => new dirRouteHomeBootstrap($log);
    }
}
