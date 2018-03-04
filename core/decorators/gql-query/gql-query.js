"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function Query(options) {
    return (t, propKey, descriptor) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        // Container.registerHandler({ object: target, propertyName: propKey, value: containerInstance => logger });
        descriptor.value = function (...args) {
            let returnValue = Object.create({});
            Object.assign(returnValue, target);
            returnValue.resolve = originalMethod;
            returnValue.args = options ? options : null;
            returnValue.method_type = 'query';
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
exports.Query = Query;
function Logger() {
    return function (object, propertyName, index) {
        const logger = new ConsoleLogger();
        index_1.default.registerHandler({ object, propertyName, index, value: containerInstance => logger });
    };
}
exports.Logger = Logger;
class ConsoleLogger {
    log(message) {
        console.log(message);
    }
}
exports.ConsoleLogger = ConsoleLogger;
