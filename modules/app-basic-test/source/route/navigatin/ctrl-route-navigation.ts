import { ngRegister } from '../../angular/ng-register';
import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';

export class ctrlRouteNavigation {

    public static $tsName: string = ngRegister.Add(
        ctrlRouteNavigation, 'ctrlRouteNavigation', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope ) {
        $log.debug(`+ ${ctrlRouteNavigation.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlRouteNavigation.$tsName}`);
        });
    }
}
