"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EffectHooks {
    constructor() {
        this.controllers = new Map();
    }
    init() { }
    setHook(name, target) {
        this.controllers.set(name, target);
    }
    getHook(name) {
        if (this.hasHook(name)) {
            return this.controllers.get(name);
        }
        else {
            throw new Error('Hook not found!');
        }
    }
    hasHook(name) {
        return this.controllers.has(name);
    }
}
exports.EffectHooks = EffectHooks;
exports.effectHooks = new EffectHooks();
