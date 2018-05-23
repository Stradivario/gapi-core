"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../../utils/container/index");
const module_service_1 = require("../../utils/services/module/module.service");
const plugin_service_1 = require("../../utils/services/plugin/plugin.service");
const moduleContainerService = index_1.default.get(module_service_1.ModuleContainerService);
const hapiPluginService = index_1.default.get(plugin_service_1.HapiPluginService);
function getInjectables(module) {
    const injectables = [];
    module.deps.forEach(i => {
        if (i.name) {
            return injectables.push(index_1.default.get(i));
        }
        else if (i.constructor === Function) {
            return injectables.push(index_1.default.get(i));
        }
        else {
            return injectables.push(i);
        }
    });
    return injectables;
}
function importPlugins(plugins, original, status) {
    plugins.forEach(plugin => {
        if (plugin.constructor === Function) {
            hapiPluginService.register(index_1.default.get(plugin));
        }
        else {
            hapiPluginService.register(plugin);
        }
    });
}
function importModules(modules, original, status) {
    modules.forEach((module) => __awaiter(this, void 0, void 0, function* () {
        if (!module) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (module.constructor === Object) {
            if (module.provide && module.useClass) {
                const original = module.useClass;
                const f = () => new original(...getInjectables(module));
                index_1.default.set(module.provide, new f.constructor());
            }
            else if (module.provide && module.useFactory) {
                if (module.useFactory.constructor === Function) {
                    if (module.deps && module.deps.length) {
                        const originalFactory = module.useFactory;
                        module.useFactory = () => __awaiter(this, void 0, void 0, function* () { return yield originalFactory(...getInjectables(module)); });
                    }
                    moduleContainerService.createModule(original.name, null).registerDependencyHandler(module);
                    index_1.default.set(module.provide, yield module.useFactory());
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
    }));
}
function GapiModule(module) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                if (!module) {
                    return new constructor();
                }
                if (module.types) {
                    importModules(module.types, original, 'types');
                }
                if (module.effects) {
                    importModules(module.effects, original, 'effects');
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
                if (module.plugins) {
                    importPlugins(module.plugins, original, 'plugins');
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
            const originalForRoot = f.forRoot;
            f.forRoot = function (args) {
                const result = originalForRoot(args);
                if (!result.services) {
                    console.info(`Consider return ${original.name}; if you dont want to use GapiModuleWithServices interface to return Pre initialized configuration services`);
                    console.info(`Your Gapi module loaded as regular import please remove ${original.name}.forRoot() and instead import just ${original.name}`);
                }
                else {
                    importModules(result.services, original, 'services');
                }
                return result.gapiModule ? result.gapiModule : result;
            };
        }
        return f;
    };
}
exports.GapiModule = GapiModule;
