"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GlobalScope(...arg) {
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
exports.GlobalScope = GlobalScope;
