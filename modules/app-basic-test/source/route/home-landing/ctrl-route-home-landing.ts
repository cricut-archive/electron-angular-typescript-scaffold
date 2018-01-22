import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { Rect } from 'lib-common2/rect';

export class ctrlRouteHomeLanding {

    public static $tsName: string = ngRegister.Add(
        ctrlRouteHomeLanding, 'ctrlRouteHomeLanding', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope ) {
        $log.debug(`+ ${ctrlRouteHomeLanding.$tsName}`);

        const lRect = new Rect();
        lRect.Expand(8);

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlRouteHomeLanding.$tsName}`);
        });
    }
}
