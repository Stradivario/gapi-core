"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/new_services/controller-service/controller.service");
const typedi_1 = require("typedi");
function Scope(...arg) {
    let scope = { scope: arg };
    // TypedPropertyDescriptor<(id: T) => T>
    return (t, propKey, desc) => {
        const descriptor = desc;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        const self = t;
        descriptor.value = function (...args) {
            let returnValue = originalMethod.apply(this, args);
            Object.assign(returnValue, scope);
            typedi_1.default.get(controller_service_1.ControllerContainerService).createController(self.constructor.name).setQuery(propertyKey, returnValue);
            return returnValue;
        };
        descriptor.value();
        return descriptor;
    };
}
exports.Scope = Scope;
