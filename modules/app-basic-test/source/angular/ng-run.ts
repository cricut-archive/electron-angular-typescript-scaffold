import { ILogService, IModule, IRootScopeService, ITemplateCacheService } from 'angular';

export class ngRun {

    constructor(inModule: IModule) {
        inModule.run([ '$templateCache', '$rootScope', '$log',
            ($templateCache: ITemplateCacheService, $rootScope: IRootScopeService, $log: ILogService) => {
                $log.debug(`ANGULAR (${inModule.name}): ngRun()`);

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
