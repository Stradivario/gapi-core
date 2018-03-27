"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Public() {
    const pub = { public: true };
    return (t, propKey, desc) => {
        const descriptor = desc;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        const self = t;
        descriptor.value = function (...args) {
            const returnValue = originalMethod.apply(args);
            Object.assign(returnValue, pub);
            return returnValue;
        };
        index_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name).setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}
exports.Public = Public;
