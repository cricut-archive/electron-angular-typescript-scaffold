import {IAttributes, IAugmentedJQuery, IDirective, IDirectiveFactory, ILogService} from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { ctrlRouteHomeLanding } from './ctrl-route-home-landing';

import './route-home-landing.less';
import tmplRouteHomeLanding from './route-home-landing.tmpl';

export class dirRouteHomeLanding implements IDirective {
    public static $tsName: string =
        ngRegister.Add(dirRouteHomeLanding, 'dirRouteHomeLanding', ['$log'], ngModule.Get());

    // DIRECTIVE SETUP
    public restrict: string = 'E';
    public require: string[] = [];
    public controller: string = ctrlRouteHomeLanding.$tsName;
    public controllerAs: string = ctrlRouteHomeLanding.$tsName;
    public template: string = tmplRouteHomeLanding;
    public bindToController: boolean = true;

    constructor(private $log: ILogService) {
        // NO OP
    }

    public static getDirective(): IDirectiveFactory {
        return ($log: ILogService) => new dirRouteHomeLanding($log);
    }
}
