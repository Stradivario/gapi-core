"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
const rxjs_1 = require("rxjs");
let HapiPluginService = class HapiPluginService {
    constructor() {
        this.plugins = new rxjs_1.BehaviorSubject([]);
    }
    register(plugin) {
        this.plugins.next([...this.plugins.getValue(), plugin]);
    }
    getPlugins() {
        return this.plugins.getValue();
    }
};
HapiPluginService = __decorate([
    index_1.Service()
], HapiPluginService);
exports.HapiPluginService = HapiPluginService;
