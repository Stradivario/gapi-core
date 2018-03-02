"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const Token_1 = require("../Token");
/**
 * Marks class as a service that can be injected using container.
 */
function Service(optionsOrServiceName) {
    return function (target) {
        const service = {
            type: target
        };
        if (typeof optionsOrServiceName === "string" || optionsOrServiceName instanceof Token_1.Token) {
            service.id = optionsOrServiceName;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        else if (optionsOrServiceName) {
            service.id = optionsOrServiceName.id;
            service.factory = optionsOrServiceName.factory;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        Container_1.Container.set(service);
    };
}
exports.Service = Service;
function GapiController(optionsOrServiceName) {
    return function (target) {
        const original = target;
        const service = {
            type: original
        };
        if (typeof optionsOrServiceName === "string" || optionsOrServiceName instanceof Token_1.Token) {
            service.id = optionsOrServiceName;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        else if (optionsOrServiceName) {
            service.id = optionsOrServiceName.id;
            service.factory = optionsOrServiceName.factory;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        Container_1.Container.set(service);
        function construct(constructor, args) {
            const c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f = function (...args) {
            console.log('Loaded Controller: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        return f;
    };
}
exports.GapiController = GapiController;
