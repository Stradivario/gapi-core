"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Mutation(options) {
    return (target, propKey, descriptor) => {
        const originalMethod = descriptor.value || {};
        const self = target;
        const propertyKey = propKey;
        const currentController = index_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name);
        descriptor.value = function (...args) {
            let returnValue = Object.create({});
            returnValue.resolve = originalMethod.bind(self);
            returnValue.args = options ? options : null;
            currentController.setMutation(propertyKey, returnValue);
            return returnValue;
        };
        return descriptor;
    };
}
exports.Mutation = Mutation;
