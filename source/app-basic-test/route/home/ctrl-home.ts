import { ILogService, IScope } from 'angular';
import { ngRegister } from '../../angular/ng-register';
import { ngModule } from '../../angular/ng-module';


export class ctrlHome {
    public static $tsName: string = ngRegister.AddResolve(ctrlHome, ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope) {
        this.$log.debug(`+ ${ctrlHome.$tsName}`);
        
        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHome.$tsName}`);
        });
    }
    
}
