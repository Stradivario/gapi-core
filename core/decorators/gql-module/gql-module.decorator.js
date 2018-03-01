"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apply_service_1 = require("../../utils/services/apply/apply.service");
require("reflect-metadata");
const typedi_1 = require("typedi");
function GapiModule(options) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                apply_service_1.ApplyServicesHook(this, options);
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            typedi_1.default.set({ id: c.prototype.name, value: new c() });
            // return new c();
            // console.log(t);
            // return new c();
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        // Reflect.defineMetadata(GapiModuleSymbol, options, f);
        // Container.set(f);
        return f;
    };
}
exports.GapiModule = GapiModule;
