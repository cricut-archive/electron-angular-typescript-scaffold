import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

export class ctrlRouteHomeBootstrap {
    public static $tsName: string = ngRegister.Add(
        ctrlRouteHomeBootstrap,
        'ctrlRouteHomeBootstrap',
        ['$log', '$scope'],
        ngModule.Get()
    );

    constructor(private $log: ILogService, private $scope: IScope) {
        $log.debug(`+ ${ctrlRouteHomeBootstrap.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlRouteHomeBootstrap.$tsName}`);
        });
    }
}
