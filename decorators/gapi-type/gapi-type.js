"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Type(type) {
    const currentType = new type();
    if (!index_1.default.has(currentType.name)) {
        index_1.default.set(currentType.name, currentType);
    }
    type = { type: index_1.default.get(currentType.name) };
    return (t, propKey, descriptor) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args) {
            const returnValue = originalMethod.apply(args);
            Object.assign(returnValue, type);
            return returnValue;
        };
        index_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name).setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}
exports.Type = Type;
