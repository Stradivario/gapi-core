"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../../utils/container/index");
function importModules(modules) {
    modules.forEach(m => index_1.default.get(m));
}
function GapiModule(options) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
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
            index_1.default.get(c);
            return ret;
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        return f;
    };
}
exports.GapiModule = GapiModule;
