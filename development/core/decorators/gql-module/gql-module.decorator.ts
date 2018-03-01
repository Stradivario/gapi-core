import { GapiModuleArguments } from "./gql-module.decorator.interface";
import { GapiModuleSymbol } from "./gql-module.symbol";
import { ApplyServicesHook } from '../../utils/services/apply/apply.service';
import 'reflect-metadata';
import Container from '../../utils/container/index';

function importModules(modules) {
    modules.forEach(m => Container.get(m));
}

export function GapiModule<T, K extends keyof T>(options: GapiModuleArguments) {
    return (target: Function) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function () {
                Object.assign(this, options);
                if (options.imports) {
                    importModules(options.imports);
                }
                if (options.services) {
                    importModules(options.services);
                }
                if (options.controllers) {
                    importModules(options.controllers);
                }
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            const ret = new c();
            Container.get(c);
            return ret;

        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        return f;
    };
}