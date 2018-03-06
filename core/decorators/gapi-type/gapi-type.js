"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Type(type) {
    type = { type: type };
    return (t, propKey, descriptor) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args) {
            let returnValue = originalMethod.apply(self, args);
            Object.assign(returnValue, type);
            return returnValue;
        };
        return descriptor;
    };
}
exports.Type = Type;
