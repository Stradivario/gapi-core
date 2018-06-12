"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../../utils/container/index");
const helpers_1 = require("../../utils/helpers");
function GapiModule(module) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                if (!module) {
                    return new constructor();
                }
                if (module.types) {
                    helpers_1.importModules(module.types, original, 'types');
                }
                if (module.effects) {
                    helpers_1.importModules(module.effects, original, 'effects');
                }
                if (module.services) {
                    helpers_1.importModules(module.services, original, 'services');
                }
                if (module.imports) {
                    helpers_1.importModules(module.imports, original, 'imports');
                }
                if (module.controllers) {
                    helpers_1.importModules(module.controllers, original, 'controllers');
                }
                if (module.plugins) {
                    helpers_1.importPlugins(module.plugins, original, 'plugins');
                }
                // const moduleContainerService = Container.get(ModuleContainerService);
                // moduleContainerService.testCreateModuleAsync(module, original);
                console.log('Loaded Module: ' + original.name);
                return new constructor();
            };
            c.prototype = constructor.prototype;
            Object.defineProperty(c, 'name', { value: constructor.name, writable: true });
            return index_1.default.get(c);
        }
        const f = function (...args) {
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
                    helpers_1.importModules(result.services, original, 'services');
                }
                return result.gapiModule ? result.gapiModule : result;
            };
        }
        return f;
    };
}
exports.GapiModule = GapiModule;
