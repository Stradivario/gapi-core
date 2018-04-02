"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/container/index");
const ngx_events_layer_service_1 = require("../../utils/services/events/ngx-events-layer.service");
function OfType(type) {
    return (target, propertyKey, descriptor) => {
        index_1.Container.get(ngx_events_layer_service_1.CacheService)
            .getLayer(type)
            .getItemObservable(type)
            .skip(1)
            .subscribe(item => descriptor.value.call(...item.data));
    };
}
exports.OfType = OfType;
