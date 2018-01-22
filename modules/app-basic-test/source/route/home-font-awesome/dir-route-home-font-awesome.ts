import {IAttributes, IAugmentedJQuery, IDirective, IDirectiveFactory, ILogService} from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { ctrlRouteHomeFontAwesome } from './ctrl-route-home-font-awesome';

import tmplRouteHomeFontAwesome from './route-home-font-awesome.tmpl';

export class dirRouteHomeFontAwesome implements IDirective {
    public static $tsName: string =
        ngRegister.Add(dirRouteHomeFontAwesome, 'dirRouteHomeFontAwesome', ['$log'], ngModule.Get());

    // DIRECTIVE SETUP
    public restrict: string = 'E';
    public require: string[] = [];
    public controller: string = ctrlRouteHomeFontAwesome.$tsName;
    public controllerAs: string = ctrlRouteHomeFontAwesome.$tsName;
    public template: string = tmplRouteHomeFontAwesome;
    public bindToController: boolean = true;

    constructor(private $log: ILogService) {
        // NO OP
    }

    public static getDirective(): IDirectiveFactory {
        return ($log: ILogService) => new dirRouteHomeFontAwesome($log);
    }
}
