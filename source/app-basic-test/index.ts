
import { bootstrap } from 'angular';
import { ngModule } from './angular/ng-module';

import './route/home-landing/ctrl-home-landing';
import './route/home/ctrl-home';

( () => {
    // MANUALY START UP ANGULAR
    bootstrap(document, [ngModule.Get().name]);
})();
