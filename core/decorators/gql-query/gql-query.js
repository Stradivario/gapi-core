"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Query(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value || {};
    descriptor.value = function (...args) {
        const result = originalMethod.apply(this, args);
        console.log(result);
        return result;
    };
    return descriptor;
}
exports.Query = Query;
