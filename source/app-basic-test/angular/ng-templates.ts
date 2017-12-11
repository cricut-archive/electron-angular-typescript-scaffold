import {ITemplateCacheService} from 'angular';
import * as _ from 'lodash';

interface ITemplateData {
    Path: string;
    Data: string;
}

export class ngTemplates {
    public RegisterTemplates($templateCache: ITemplateCacheService): void {
        $templateCache;

        _.map(this.mTemplates, t => $templateCache.put(t.Path.split('/').slice(2).join('/'), t.Data));
    }

    private mTemplates: ITemplateData[] = [
        //@@AUTO GENERATED TEMPLATES
    ];

}
