"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Mutation(t, propertyKey, descriptor) {
    const target = t;
    const originalMethod = descriptor.value || {};
    descriptor.value = function (...args) {
        let result = originalMethod.apply(this, args);
        result.resolve = originalMethod;
        return result;
    };
    return descriptor;
}
exports.Mutation = Mutation;
