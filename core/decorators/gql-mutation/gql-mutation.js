"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Mutation(options) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value || {};
        const self = target;
        descriptor.value = function (...args) {
            let result = originalMethod.apply(this, args);
            if (options) {
                let mockArgs = {};
                Object.keys(options).forEach(a => {
                    mockArgs[a] = {};
                    mockArgs[a].type = options[a];
                });
                result = Object.assign({ args: mockArgs }, result);
            }
            if (result.scope) {
                result = Object.assign({ scope: result.scope }, result);
            }
            else {
                if (self.Gconfig.scope) {
                    result = Object.assign({ scope: self.Gconfig.scope }, result);
                }
            }
            if (self.Gconfig.type) {
                result = Object.assign({ type: self.Gconfig.type }, result);
            }
            result.resolve = originalMethod;
            return result;
        };
        return descriptor;
    };
}
exports.Mutation = Mutation;
