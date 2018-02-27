"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const __1 = require("../..");
function Scope(...arg) {
    const scope = { scope: arg };
    const ConfigService = typedi_1.default.get(__1.ControllerConfigService);
    return (t, propertyName, desc) => {
        const target = t;
        const descriptor = desc;
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let result = originalMethod.apply(this, args);
            console.log('DADADADADADASCOPE', result);
            result = Object.assign({}, scope, result);
            return result;
        };
        return descriptor;
    };
}
exports.Scope = Scope;
