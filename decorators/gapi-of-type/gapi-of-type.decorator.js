"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/container/index");
const events_layer_service_1 = require("../../utils/services/events/events-layer.service");
const effect_hooks_1 = require("../../utils/services/effect-hook/effect-hooks");
function OfType(type) {
    return (target, propertyKey, descriptor) => {
        const t = target;
        index_1.Container.get(events_layer_service_1.CacheService)
            .getLayer(type)
            .getItemObservable(type)
            .subscribe((item) => __awaiter(this, void 0, void 0, function* () {
            const c = effect_hooks_1.effectHooks.getHook(t.constructor.name);
            const originalDesc = descriptor.value.bind(c);
            yield originalDesc(...item.data);
        }));
    };
}
exports.OfType = OfType;
