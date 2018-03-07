"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Subscribe(asyncIteratorFunction, filterFn) {
    let subscribe = { subscribe: asyncIteratorFunction };
    return (t, propKey, desc) => {
        const descriptor = desc;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        const self = t;
        descriptor.value = function (...args) {
            let returnValue = originalMethod.apply(self, args);
            Object.assign(returnValue, subscribe);
            return returnValue;
        };
        index_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name).setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}
exports.Subscribe = Subscribe;
