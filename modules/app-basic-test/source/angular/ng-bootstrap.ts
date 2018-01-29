import { bootstrap, module } from 'angular';
import { ngModule } from './ng-module';
import { ngConfig } from './ng-config';
import { ngRun } from './ng-run';

export class ngBootstrap {
    private mConfig: ngConfig;
    private mRun: ngRun;

    public constructor() {
        console.debug(`ANGULAR (${this.Name}): ngBootstrap()`);

        this.mConfig = new ngConfig(ngModule.Get());
        this.mRun = new ngRun(ngModule.Get());
    }

    public get Name(): string {
        return ngModule.Get().name;
    }
}
