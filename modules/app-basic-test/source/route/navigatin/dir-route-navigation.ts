import { IDirective, IDirectiveFactory, ILogService } from 'angular';
import { ngRegister } from '../../angular/ng-register';
import { ngModule } from '../../angular/ng-module';

import { ctrlRouteNavigation } from './ctrl-route-navigation';
import tmplRouteNavigation from './route-navigation.tmpl';

export class dirRouteNavigation implements IDirective {
    public static $tsName: string = ngRegister.Add(
        dirRouteNavigation,
        'dirRouteNavigation',
        ['$log'],
        ngModule.Get()
    );

    // DIRECTIVE SETUP
    public restrict: string = 'E';
    public require: string[] = [];
    public controller: string = ctrlRouteNavigation.$tsName;
    public controllerAs: string = ctrlRouteNavigation.$tsName;
    public template: string = tmplRouteNavigation;
    public bindToController: boolean = true;

    constructor(private $log: ILogService) {
        // NO OP
    }

    public static getDirective(): IDirectiveFactory {
        return ($log: ILogService) => new dirRouteNavigation($log);
    }
}
