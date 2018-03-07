"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Query(options) {
    return (t, propKey, descriptor) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        descriptor.value = function (...args) {
            this.resolve = originalMethod;
            this.args = options ? options : null;
            this.method_type = 'query';
            this.method_name = propertyKey;
            this.target = target;
            return this;
        };
        index_1.default.get(controller_service_1.ControllerContainerService)
            .createController(target.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}
exports.Query = Query;
