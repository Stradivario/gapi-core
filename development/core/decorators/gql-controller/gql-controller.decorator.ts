import 'reflect-metadata';
import { GapiControllerArguments } from "./gql-controller.decorator.interface";
import { GapiControllerSymbol } from './gql-controller.symbol';
import Container, { Service } from 'typedi';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GapiMutationsService } from '../../utils/services/mutation/mutation.service';
import { GapiQueryService } from '../../utils/services/query/query.service';
import { ControllerConfigService } from '../../utils/services/controller-config/controller-config.service';

export function GapiController(opt?: GapiControllerArguments) {
    const controllerConfigService = Container.get(ControllerConfigService);
    const options = opt;
    return (target: any) => {
        const original = target;
        controllerConfigService.set(original.prototype.name, options);
        function construct(constructor, args) {
            const c: any = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        f.prototype.Gquery = Container.get(GapiQueryService).get(original.prototype.name);
        f.prototype.Gmutation = Container.get(GapiMutationsService).get(original.prototype.name);
        f.prototype.Gconfig = controllerConfigService.get(original.prototype.name);
        f.prototype.Gconfig.scope = f.prototype.Gconfig.scope || ['ADMIN'];
        // Reflect.defineMetadata(GapiControllerSymbol, options, f);
        return f;
    };
}