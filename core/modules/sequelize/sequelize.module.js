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
const sequelize_typescript_1 = require("sequelize-typescript");
const utils_1 = require("../../utils");
const container_1 = require("../../utils/container");
let GapiSequelizeService = GapiSequelizeService_1 = class GapiSequelizeService extends sequelize_typescript_1.Sequelize {
    constructor(c) {
        const config = container_1.default.get(utils_1.ConfigService);
        super(c || config.SEQUELIZE_CONFIG.testing);
    }
    sync(settings) {
        return super.sync(settings || { force: false, logging: true });
    }
    static forRoot(config) {
        const configService = container_1.default.get(utils_1.ConfigService);
        Object.assign(configService.SEQUELIZE_CONFIG, config);
        return GapiSequelizeService_1;
    }
};
GapiSequelizeService = GapiSequelizeService_1 = __decorate([
    container_1.Service(),
    __metadata("design:paramtypes", [Object])
], GapiSequelizeService);
exports.GapiSequelizeService = GapiSequelizeService;
var GapiSequelizeService_1;
