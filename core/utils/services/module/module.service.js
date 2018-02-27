"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ModuleService = class ModuleService {
    constructor() {
        this.modules = new Map();
    }
    get(name) {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        }
        else {
            throw new Error(`Missing module: ${name}`);
        }
    }
    set(name, config) {
        if (!this.modules.has(name)) {
            this.modules.set(name, config);
        }
    }
};
ModuleService = __decorate([
    typedi_1.Service()
], ModuleService);
exports.ModuleService = ModuleService;
