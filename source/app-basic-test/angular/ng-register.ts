import { ILogService, injector, IModule } from 'angular';
import * as _ from 'lodash';

export class ngRegister {
    private static $log: ILogService = injector(['ng']).get('$log');

    private static mItems: { [id: string]: string[]; } = {};

    public static AddResolve(inObject: any, inInject: string[], inModule: IModule): string {
        const lParams: string[] = this.GetParamNames(inObject.prototype.constructor);
        const lClassName: string|undefined = lParams.shift();
        if (!lClassName) {
            throw new Error('APPINJECT: Invalid Class Name');
        }

        Object.keys(this.mItems).forEach(k => {
            if(this.mItems[k].indexOf(lClassName) != -1) {
                throw new Error(`APPINJECT: Resolve Name Collision ${lClassName} (${k} & ${inModule.name})`);
            }
        });

        if (inInject.length !== lParams.length) {
            throw new Error(`APPINJECT: Inject Param Mismatch In ${lClassName}`);    

        } else {
            inObject.$tsApp = inModule.name;
            inObject.$inject = inInject;

            if (lClassName.indexOf('dir') === 0) {
                inModule.directive(lClassName, inObject);
            } else if (lClassName.indexOf('srvc') === 0) {
                inModule.service(lClassName, inObject);
            } else if (lClassName.indexOf('ctrl') === 0) {
                inModule.controller(lClassName, inObject);
            } else if (lClassName.indexOf('fltr') === 0) {
                inModule.filter(lClassName, inObject);
            } else {
                throw new Error(`APPINJECT: Unkown Resolve Type For ${lClassName}`);
            }
            
            if (!this.mItems[inModule.name]) {
                this.mItems[inModule.name] = [];
            }
            
            this.mItems[inModule.name].push(lClassName);
        }
 
        return lClassName;
    }


    //TODO: MOVE OUT TO COMMON
    private static STRIP_COMMENTS: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    private static ARGUMENT_NAMES: RegExp = /([^\s,]+)/g;
    private static FUNCTION_NAME: RegExp = /(function )([^(\ ]+)/m;

    public static GetParamNames(func: any): string[] {
        const lBody: string = (func.toString()).replace(this.STRIP_COMMENTS, '');
        const lFunction: string = (lBody.match(this.FUNCTION_NAME) as Array<string>)[2];
        const lArgs: string[] = (lBody.slice(lBody.indexOf('(') + 1, lBody.indexOf(')')).match(this.ARGUMENT_NAMES))||[];
       
        lArgs.unshift(lFunction);
        return lArgs;
    }

}

