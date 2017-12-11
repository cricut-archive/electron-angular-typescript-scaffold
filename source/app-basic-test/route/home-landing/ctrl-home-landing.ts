import { ILogService, IScope } from 'angular';
import { ngRegister } from '../../angular/ng-register';
import { ngModule } from '../../angular/ng-module';


export class ctrlHomeLanding {
    
    public static $tsName: string = ngRegister.AddResolve(ctrlHomeLanding, ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope ) {
        $log.debug(`+ ${ctrlHomeLanding.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHomeLanding.$tsName}`);
        });
    }
}
