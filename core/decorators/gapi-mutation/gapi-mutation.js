"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Mutation(options) {
    return (t, propKey, descriptor) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        descriptor.value = function (...args) {
            const returnValue = Object.create({});
            returnValue.resolve = originalMethod;
            returnValue.args = options ? options : null;
            returnValue.method_type = 'mutation';
            returnValue.method_name = propertyKey;
            returnValue.target = target;
            return returnValue;
        };
        index_1.default.get(controller_service_1.ControllerContainerService)
            .createController(target.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}
exports.Mutation = Mutation;
