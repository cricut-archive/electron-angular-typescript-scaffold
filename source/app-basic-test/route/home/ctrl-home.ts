import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

import { Rect } from 'lib-common';

export class ctrlHome {
    public static $tsName: string =
        ngRegister.Add(ctrlHome, 'ctrlHome', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope) {
        this.$log.debug(`+ ${ctrlHome.$tsName}`);

        const lRect = new Rect();

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHome.$tsName}`);
        });
    }

}
