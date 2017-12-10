import { bootstrap } from "angular";
import {ngModule} from './ng-module';

declare global {
    interface Window { ngModule: ngModule; }
}

( ()=>{
    const lAppModule = new ngModule();   
    window.ngModule = lAppModule;

    bootstrap(document, [lAppModule.ModuleName]);
})();