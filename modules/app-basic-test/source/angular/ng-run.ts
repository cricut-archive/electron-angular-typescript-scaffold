import { ILogService, IModule, IRootScopeService, ITemplateCacheService } from 'angular';
import { ngTemplates } from './ng-templates';

export class ngRun {

    constructor(inModule: IModule) {
        inModule.run([ '$templateCache', '$rootScope', '$log',
            ($templateCache: ITemplateCacheService, $rootScope: IRootScopeService, $log: ILogService) => {
                $log.debug('ANGULAR: ngRun()');

                const lTemplates: ngTemplates = new ngTemplates();
                lTemplates.RegisterTemplates($templateCache);

                $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
                    $log.debug('STATE: ');
                });

                $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
                    $log.debug('STATE: ');
                });

                $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
                    $log.debug(`STATE: ERROR '${error}'`);
                });

            }]);
        }
    }
