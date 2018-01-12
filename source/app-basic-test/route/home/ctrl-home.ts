import { ILogService, IScope } from 'angular';
import { ngModule } from '../../angular/ng-module';
import { ngRegister } from '../../angular/ng-register';

// import { Point } from 'lib-common/point';

export class ctrlHome {
    public static $tsName: string =
        ngRegister.Add(ctrlHome, 'ctrlHome', ['$log', '$scope'], ngModule.Get());

    constructor(private $log: ILogService, private $scope: IScope) {
        this.$log.debug(`+ ${ctrlHome.$tsName}`);

        // const lPoint: Point = new Point(0, 0);
        // lPoint.Clone();

        this.$scope.$on('$destroy', () => {
            this.$log.debug(`- ${ctrlHome.$tsName}`);
        });
    }

}
