"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
const controller_config_1 = require("./controller-config");
class ControllerMapping {
    constructor(name, type) {
        this._settings = new controller_config_1.ControllerMappingSettings();
        this._descriptors = new Map();
        this._ready = new Subject_1.Subject();
        this._controller_name = name;
        this._type = type;
    }
    setSettings(settings) {
        this._settings = settings;
    }
    setDescriptor(name, descriptor) {
        this._descriptors.set(name, descriptor);
    }
    getDescriptor(name) {
        return this._descriptors.get(name);
    }
    getAllDescriptors() {
        return Array.from(this._descriptors.keys());
    }
}
exports.ControllerMapping = ControllerMapping;
