import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

export class ctrlRouteHomeFontAwesome {
    public static $tsName: string = ngRegister.Add(
        ctrlRouteHomeFontAwesome,
        'ctrlRouteHomeFontAwesome',
        ['$log', '$scope'],
        ngModule.Get()
    );

    constructor(private $log: ILogService, private $scope: IScope) {
        $log.debug(`+ ${ctrlRouteHomeFontAwesome.$tsName}`);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlRouteHomeFontAwesome.$tsName}`);
        });
    }
}
