
import { bootstrap, auto } from 'angular';
import { ngBootstrap } from './angular/ng-bootstrap';

let ngApp: auto.IInjectorService;

( () => {
    // MANUALY START UP ANGULAR
    console.debug('ANGULAR: Index Startup');
    ngApp = bootstrap(document, [new ngBootstrap().Name]);
})();
