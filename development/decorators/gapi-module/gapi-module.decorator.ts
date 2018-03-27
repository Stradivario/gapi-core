import { GapiModuleArguments } from './gapi-module.decorator.interface';
import { GapiModuleSymbol } from './gapi-module.symbol';
import { ApplyServicesHook } from '../../utils/services/apply/apply.service';
import 'reflect-metadata';
import Container from '../../utils/container/index';
import { ServiceMetadata } from '../../utils/container';
import { ModuleContainerService } from '../../utils/services/module/module.service';

const moduleContainerService = Container.get(ModuleContainerService);

function getInjectables(module) {
    const injectables = [];
    module.deps.forEach(i => {
        if (i.constructor === Function) {
            injectables.push(Container.get(i));
        } else {
            injectables.push(i);
        }
    });
    return injectables;
}

function importModules(modules, original, status) {
    modules.forEach((module) => {
        if (!module) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (module.constructor === Object) {
            if (module.provide && module.useClass) {
                const original = module.useClass;
                const f: any = () => new original(...getInjectables(module));
                Container.set(module.provide, new f.constructor());
            } else if (module.provide && module.useFactory) {
                if (module.useFactory.constructor === Function) {
                    if (module.deps && module.deps.length) {
                        const originalFactory = module.useFactory;
                        module.useFactory = () => originalFactory(...getInjectables(module));
                    }
                    moduleContainerService.createModule(original.name, null).registerDependencyHandler(module);
                    Container.set(module.provide, module.useFactory());
                } else {
                    throw new Error(`Wrong Factory function ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
                }
            } else if (module.provide && module.useValue) {
                Container.set(module.provide, module.useValue);
            } else {
                throw new Error(`Wrong Injectable '${status}' ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
            }
        } else {
            let name = module.name;
            if (name === 'f') {
                name = module.constructor.name;
            }
            Object.defineProperty(module, 'name', { value: name, writable: true });
            Container.get(module);
        }

    });
}

export function GapiModule<T, K extends keyof T>(module: GapiModuleArguments) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function () {
                if (module.types) {
                    importModules(module.types, original, 'types');
                }
                if (module.services) {
                    importModules(module.services, original, 'services');
                }
                if (module.imports) {
                    importModules(module.imports, original, 'imports');
                }
                if (module.controllers) {
                    importModules(module.controllers, original, 'controllers');
                }
                this.injectables = module;
                moduleContainerService.createModule(original.name, this.injectables);
                return new constructor();
            };

            c.prototype = constructor.prototype;
            Object.defineProperty(c, 'name', { value: constructor.name, writable: true });
            return Container.get(c);

        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        if (original.forRoot) {
            f.forRoot = original.forRoot;
        }
        return f;
    };
}