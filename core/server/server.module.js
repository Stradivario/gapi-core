"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ConfigFactory = class ConfigFactory {
    setConfig(config) {
        this.config = config;
    }
};
ConfigFactory = __decorate([
    typedi_1.Service()
], ConfigFactory);
exports.ConfigFactory = ConfigFactory;
let GapiServerModule = GapiServerModule_1 = class GapiServerModule {
    constructor() {
        Object.assign(this, typedi_1.default.get(ConfigFactory));
    }
    start() {
        return 1;
    }
    static forRoot(config) {
        typedi_1.default.get(ConfigFactory).setConfig(config);
        return GapiServerModule_1;
    }
};
GapiServerModule = GapiServerModule_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], GapiServerModule);
exports.GapiServerModule = GapiServerModule;
var GapiServerModule_1;
