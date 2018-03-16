"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../../utils/container/index");
function importModules(modules, original, status) {
    modules.forEach(module => {
        if (!module) {
            throw new Error(`Incorrect importing "${status}" inside ${original.name}`);
        }
        let name = module.name;
        if (name === 'f') {
            name = module.constructor.name;
        }
        Object.defineProperty(module, 'name', { value: name, writable: true });
        index_1.default.get(module);
    });
}
function GapiModule(options) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                if (options.imports) {
                    importModules(options.imports, original, 'imports');
                }
                if (options.services) {
                    importModules(options.services, original, 'services');
                }
                if (options.controllers) {
                    importModules(options.controllers, original, 'controllers');
                }
                this.options = options;
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
