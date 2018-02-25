"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apply_service_1 = require("../../utils/services/apply/apply.service");
require("reflect-metadata");
function GapiModule(options) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                apply_service_1.ApplyServicesHook(this, options);
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        // Reflect.defineMetadata(GapiModuleSymbol, options, f);
        return f;
    };
}
exports.GapiModule = GapiModule;
