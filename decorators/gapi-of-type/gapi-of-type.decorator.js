"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/container/index");
const ngx_events_layer_service_1 = require("../../utils/services/events/ngx-events-layer.service");
const effect_hooks_1 = require("../../utils/services/effect-hook/effect-hooks");
function OfType(type) {
    return (target, propertyKey, descriptor) => {
        const t = target;
        index_1.Container.get(ngx_events_layer_service_1.CacheService)
            .getLayer(type)
            .getItemObservable(type)
            .subscribe(item => {
            const c = effect_hooks_1.effectHooks.getHook(t.constructor.name);
            const originalDesc = descriptor.value.bind(c);
            originalDesc(...item.data);
        });
    };
}
exports.OfType = OfType;
