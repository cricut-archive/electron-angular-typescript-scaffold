import { ILogService, IModule, injector } from 'angular';
import * as _ from 'lodash';

export class ngRegister {
    private static $log: ILogService = injector(['ng']).get('$log');

    private static mItems: { [id: string]: string[]; } = {};

    // TODO: MOVE OUT TO COMMON
    private static STRIP_COMMENTS: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    private static ARGUMENT_NAMES: RegExp = /([^\s,]+)/g;
    private static FUNCTION_NAME: RegExp = /(function )([^(\ ]+)/m;

    /**
     * Adds an custom object to Angulars DI chain.
     * @param inObject Angular object model to register.
     * @param inName Name for dependancy injection.
     * @param inInject Objects Angular DI string.
     * @param inModule Module to register object with.
     */
    public static Add(inObject: any, inName: string, inInject: string[], inModule: IModule): string {
        const lParams: string[] = this.GetParamNames(inObject.prototype.constructor);
        const lClassName: string|undefined = lParams.shift();

        if (!lClassName || !inName) {
            throw new Error('APPINJECT: Invalid Class Name');
        }

        Object.keys(this.mItems).forEach((k) => {
            if (this.mItems[k].indexOf(inName) !== -1) {
                throw new Error(`APPINJECT: Resolve Name Collision ${inName} (${k} & ${inModule.name})`);
            }
        });

        if (inInject.length !== lParams.length) {
            throw new Error(`APPINJECT: Inject Param Mismatch In ${inName}`);

        } else {
            inObject.$tsApp = inModule.name;
            inObject.$inject = inInject;

            if (inName.indexOf('dir') === 0) {
                const lDirective = inObject.getDirective();
                lDirective.$inject = inObject.$inject;
                inModule.directive(inName, lDirective);
            } else if (inName.indexOf('srvc') === 0) {
                inModule.service(inName, inObject);
            } else if (inName.indexOf('ctrl') === 0) {
                inModule.controller(inName, inObject);
            } else if (inName.indexOf('fltr') === 0) {
                inModule.filter(inName, inObject);
            } else {
                throw new Error(`APPINJECT: Unkown Resolve Type For ${inName}`);
            }

            if (!this.mItems[inModule.name]) {
                this.mItems[inModule.name] = [];
            }

            this.mItems[inModule.name].push(inName);
        }

        return inName;
    }

    public static GetParamNames(func: any): string[] {
        const lBody: string = (func.toString()).replace(this.STRIP_COMMENTS, '');
        const lFunction: string = (lBody.match(this.FUNCTION_NAME) as string[])[2];
        const lArgs: string[] = (lBody.slice(lBody.indexOf('(') + 1, lBody.indexOf(')'))
                                    .match(this.ARGUMENT_NAMES)) || [];

        lArgs.unshift(lFunction);
        return lArgs;
    }

}
