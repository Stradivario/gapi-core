"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
class ModuleMapping {
    constructor(name, injectables) {
        this._module_name = name;
        this._injectables = injectables;
    }
}
exports.ModuleMapping = ModuleMapping;
let ModuleContainerService = class ModuleContainerService {
    constructor() {
        this.controllers = new Map();
    }
    getModule(name) {
        if (!this.controllers.has(name)) {
            return this.controllers.get(name);
        }
        else {
            throw new Error('Missing module controllers internal Gapi Error!');
        }
    }
    createModule(name, injectables) {
        if (this.controllers.has(name)) {
            return this.controllers.get(name);
        }
        else {
            this.controllers.set(name, new ModuleMapping(name, injectables));
            return this.controllers.get(name);
        }
    }
};
ModuleContainerService = __decorate([
    index_1.Service()
], ModuleContainerService);
exports.ModuleContainerService = ModuleContainerService;
