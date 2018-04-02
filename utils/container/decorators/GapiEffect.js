"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../Token");
const Container_1 = require("../Container");
function GapiEffect(optionsOrServiceName) {
    return function (target) {
        const original = target;
        original.prototype._effect = true;
        const service = {
            type: original
        };
        if (typeof optionsOrServiceName === 'string' || optionsOrServiceName instanceof Token_1.Token) {
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
exports.GapiEffect = GapiEffect;
