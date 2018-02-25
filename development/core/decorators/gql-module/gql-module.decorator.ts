import { GapiModuleArguments } from "./gql-module.decorator.interface";
import { GapiModuleSymbol } from "./gql-module.symbol";
import { ApplyServicesHook } from '../../utils/services/apply/apply.service';
import 'reflect-metadata';

export function GapiModule(options: GapiModuleArguments) {
    return (target: any) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function () {
                ApplyServicesHook(this, options);
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
        // Reflect.defineMetadata(GapiModuleSymbol, options, f);
        return f;
    };
}