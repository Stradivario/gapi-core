"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../../utils/container/index");
const module_service_1 = require("../../utils/services/module/module.service");
const moduleContainerService = index_1.default.get(module_service_1.ModuleContainerService);
function importModules(modules, original, status) {
    modules.forEach((module) => {
        if (!module) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (module.constructor === Object) {
            if (module.provide && module.useClass) {
                index_1.default.set(module.provide, new module.useClass());
            }
            else if (module.provide && module.useFactory) {
                if (module.useFactory.constructor === Function) {
                    // moduleContainerService.createModule(original.name, null).registerDependencyHandler(module);
                    let injectables = [...module.deps];
                    let resolvedInjectables = [];
                    injectables.forEach(i => {
                        if (i.constructor === Function) {
                            resolvedInjectables.push(index_1.default.get(i));
                        }
                        else {
                            resolvedInjectables.push(i);
                        }
                    });
                    const originalFactory = module.useFactory;
                    module.useFactory = function () {
                        return originalFactory(...resolvedInjectables);
                    };
                    index_1.default.set(module.provide, module.useFactory());
                }
                else {
                    throw new Error(`Wrong Factory function ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
                }
            }
            else if (module.provide && module.useValue) {
                index_1.default.set(module.provide, module.useValue);
            }
            else {
                throw new Error(`Wrong Injectable '${status}' ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
            }
        }
        else {
            let name = module.name;
            if (name === 'f') {
                name = module.constructor.name;
            }
            Object.defineProperty(module, 'name', { value: name, writable: true });
            index_1.default.get(module);
        }
    });
}
function GapiModule(module) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
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
            return index_1.default.get(c);
        }
        const f = function (...args) {
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
exports.GapiModule = GapiModule;
