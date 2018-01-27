import { bootstrap, auto } from 'angular';
import { ngBootstrap } from './angular/ng-bootstrap';

import '../../../node_modules/font-awesome/less/font-awesome.less';
import '../../../node_modules/bootstrap/less/bootstrap.less';

let ngApp: auto.IInjectorService;

(() => {
    // MANUALY START UP ANGULAR
    console.debug('ANGULAR: Index Startup');
    ngApp = bootstrap(document, [new ngBootstrap().Name]);
})();
