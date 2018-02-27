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
const typedi_1 = require("typedi");
const config_service_1 = require("../../services/config/config.service");
let SequelizeService = class SequelizeService extends sequelize_typescript_1.Sequelize {
    constructor(config) {
        super(config.SEQUELIZE_CONFIG.testing);
        this.config = config;
    }
    sync(settings) {
        return super.sync(settings || { force: false, logging: true });
    }
    close() {
        return super.close();
    }
};
SequelizeService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], SequelizeService);
exports.SequelizeService = SequelizeService;
