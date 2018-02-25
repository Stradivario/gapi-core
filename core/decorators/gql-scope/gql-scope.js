"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Scope(...arg) {
    const scope = { scope: arg };
    return (t, propertyName, descriptor) => {
        const target = t;
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let result = originalMethod.apply(this, args);
            result = Object.assign({}, scope, result);
            return result;
        };
        return descriptor;
    };
}
exports.Scope = Scope;
