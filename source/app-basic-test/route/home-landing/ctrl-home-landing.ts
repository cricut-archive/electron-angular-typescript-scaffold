import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

export class ctrlHomeLanding {

    public static $tsName: string = ngRegister.Add(
        ctrlHomeLanding, 'ctrlHomeLanding', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope ) {
        $log.debug(`+ ${ctrlHomeLanding.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHomeLanding.$tsName}`);
        });
    }
}
