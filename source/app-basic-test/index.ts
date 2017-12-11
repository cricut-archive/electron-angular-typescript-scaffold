
import { bootstrap } from 'angular';
import { ngModule } from './angular/ng-module';

import './route/home/ctrl-home';
import './route/home-landing/ctrl-home-landing';

( ()=>{
    //MANUALY START UP ANGULAR
    bootstrap(document, [ngModule.Get().name]);
})();
