import 'reflect-metadata';
import { GapiControllerArguments } from "./gql-controller.decorator.interface";
import { GapiControllerSymbol } from './gql-controller.symbol';
import Container, { Service } from 'typedi';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GapiMutationsService } from '../../utils/services/mutation/mutation.service';
import { GapiQueryService } from '../../utils/services/query/query.service';
import { ControllerConfigService } from '../../utils/services/controller-config/controller-config.service';
import { ControllerContainerService } from '../../utils/new_services/controller-service/controller.service';
import { ControllerMappingSettings } from '../../utils/new_services/controller-service/controller.service';

export function GapiController(settings?: ControllerMappingSettings) {
    const options = settings;
    return (target: any) => {
        const original = target;
        const currentController = Container.get(ControllerContainerService).createController(original.prototype.name);
        function construct(constructor, args) {
            const c: any = function () {
                this.gapi_settings  = currentController._settings;
                this.gapi_mutations = currentController._mutations;
                this.gapi_queries = currentController._queries;
                this.gapi_subscriptions = currentController._subscriptions;
                if(options) {
                    Object.assign(this.gapi_settings, options)
                }
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            // Container.set(f, new c());
            // return new c();
            // return new c();
        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        Container.set(f);
        return f;
    };
}