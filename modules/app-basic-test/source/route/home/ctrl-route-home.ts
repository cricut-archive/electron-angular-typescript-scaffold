import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

export class ctrlRouteHome {
    public static $tsName: string =
        ngRegister.Add(ctrlRouteHome, 'ctrlRouteHome', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope) {
        this.$log.debug(`+ ${ctrlRouteHome.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlRouteHome.$tsName}`);
        });
    }

}
