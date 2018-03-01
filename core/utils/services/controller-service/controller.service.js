"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
class ControllerMappingSettings {
    constructor() {
        this.scope = ['ADMIN'];
    }
}
exports.ControllerMappingSettings = ControllerMappingSettings;
class ControllerMapping {
    constructor(name) {
        this._settings = new ControllerMappingSettings();
        this._queries = new Map();
        this._subscriptions = new Map();
        this._mutations = new Map();
        this._controller_name = name;
    }
    setMutation(name, value) {
        this._mutations.set(name, value);
    }
    setSubscription(name, value) {
        this._subscriptions.set(name, value);
    }
    setQuery(name, value) {
        this._queries.set(name, value);
    }
    setSettings(settings) {
        this._settings = settings;
    }
    getQuery(name) {
        return this._queries.get(name);
    }
    getMutation(name) {
        return this._queries.get(name);
    }
    getSubscription(name) {
        return this._queries.get(name);
    }
}
exports.ControllerMapping = ControllerMapping;
let ControllerContainerService = class ControllerContainerService {
    constructor() {
        this.controllers = new Map();
    }
    getController(name) {
        if (!this.controllers.has(name)) {
            return this.createController(name);
        }
        else {
            return this.controllers.get(name);
        }
    }
    createController(name) {
        if (this.controllers.has(name)) {
            return this.controllers.get(name);
        }
        else {
            this.controllers.set(name, new ControllerMapping(name));
            return this.controllers.get(name);
        }
    }
};
ControllerContainerService = __decorate([
    index_1.Service()
], ControllerContainerService);
exports.ControllerContainerService = ControllerContainerService;
