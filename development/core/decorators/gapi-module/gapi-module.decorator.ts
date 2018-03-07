import { GapiModuleArguments } from "./gapi-module.decorator.interface";
import { GapiModuleSymbol } from "./gapi-module.symbol";
import { ApplyServicesHook } from '../../utils/services/apply/apply.service';
import 'reflect-metadata';
import Container from '../../utils/container/index';

function importModules(modules) {
    modules.forEach(module => {
        let name = module.name;
        if (name === 'f') {
            name = module.constructor.name;
        }
        Object.defineProperty(module, 'name', { value: name, writable: true });
        Container.get(module)        
    });
}

export function GapiModule<T, K extends keyof T>(options: GapiModuleArguments) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function() {

                if (options.imports) {
                    importModules(options.imports);
                }
                if (options.services) {
                    importModules(options.services);
                }
                if (options.controllers) {
                    importModules(options.controllers);
                }
                this.options = options;
                return new constructor();
            };
   
            c.prototype = constructor.prototype; 
            Object.defineProperty(c, 'name', {value: constructor.name, writable: true});
            return Container.get(c);

        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype; 
        if(original.forRoot) {
            f.forRoot = original.forRoot; 
        }
        return f;
    };
}