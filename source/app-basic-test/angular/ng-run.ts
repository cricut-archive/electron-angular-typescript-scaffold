import { IModule, ITemplateCacheService } from 'angular';
import { ngTemplates } from './ng-templates';


export class ngRun {

    constructor(inModule: IModule) {
        inModule.run([ '$templateCache',
            function($templateCache: ITemplateCacheService) {
                const lTemplates:ngTemplates = new ngTemplates();
                lTemplates.RegisterTemplates($templateCache);
            }]);
        }
    }
