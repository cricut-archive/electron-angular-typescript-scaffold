import {ITemplateCacheService} from 'angular';
import * as _ from 'lodash';

interface ITemplateData {
    Path: string;
    Data: string;
}

export class ngTemplates {
    private mTemplates: ITemplateData[] = [
        // @@AUTO GENERATED TEMPLATES
    ];

    public RegisterTemplates($templateCache: ITemplateCacheService): void {
        console.debug('ANGULAR: ngTemplates::RegisterTemplates()');
        _.map(this.mTemplates, (t) => $templateCache.put(t.Path.split('/').slice(2).join('/'), t.Data));
    }

}
