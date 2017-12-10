import { IModule, module } from "angular";

export class ngModule {

    public get ModuleName():string { return 'appBasicTest'; }

    private mModule: IModule;
    
    public constructor() {
        this.mModule = module(this.ModuleName, []); 
    }

}