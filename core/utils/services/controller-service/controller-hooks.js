"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ControllerHooks {
    constructor() {
        this.controllers = new Map();
    }
    init() {
        // console.log('Hooks initied')
    }
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
exports.ControllerHooks = ControllerHooks;
exports.controllerHooks = new ControllerHooks();
