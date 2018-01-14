import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

export class ctrlHome {
    public static $tsName: string =
        ngRegister.Add(ctrlHome, 'ctrlHome', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope) {
        this.$log.debug(`+ ${ctrlHome.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHome.$tsName}`);
        });
    }

}
