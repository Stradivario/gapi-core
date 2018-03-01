"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/new_services/controller-service/controller.service");
const typedi_1 = require("typedi");
function Query(options) {
    return (target, propKey, descriptor) => {
        const originalMethod = descriptor.value || {};
        const self = target;
        const propertyKey = propKey;
        const currentController = typedi_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name);
        descriptor.value = function (...args) {
            let returnValue = Object.create({});
            returnValue.resolve = originalMethod.bind(self);
            returnValue.args = options ? options : null;
            currentController.setQuery(propertyKey, returnValue);
            return returnValue;
        };
        descriptor.value();
        return descriptor;
    };
}
exports.Query = Query;
