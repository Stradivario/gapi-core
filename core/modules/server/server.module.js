"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_service_1 = require("../../utils/services/config/config.service");
const server_service_1 = require("../../utils/services/server/server.service");
;
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
    start() {
        const utilService = typedi_1.default.get(server_service_1.ServerUtilService);
        return utilService.startServer();
    }
    static forRoot(config) {
        typedi_1.default.get(config_service_1.ConfigService).setAppConfig(config);
        return GapiServerModule_1;
    }
};
GapiServerModule = GapiServerModule_1 = __decorate([
    typedi_1.Service()
], GapiServerModule);
exports.GapiServerModule = GapiServerModule;
var GapiServerModule_1;
