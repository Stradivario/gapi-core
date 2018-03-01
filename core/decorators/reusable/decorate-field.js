"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function decorate(options) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value || {};
        const self = target;
        descriptor.value = function (...args) {
            let returnValue = Object.create({});
            returnValue.resolve = originalMethod;
            returnValue.args = options;
            return returnValue;
        };
        return descriptor;
    };
}
exports.decorate = decorate;
;
