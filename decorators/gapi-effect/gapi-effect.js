"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
const ngx_events_layer_service_1 = require("../../utils/services/events/ngx-events-layer.service");
function Effect(name) {
    const type = { effect: name };
    index_1.default.get(ngx_events_layer_service_1.CacheService).getLayer(name);
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
exports.Effect = Effect;
