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
const fs_1 = require("fs");
const index_1 = require("../../../utils/container/index");
const Container_1 = require("../../container/Container");
const connection_hook_service_1 = require("../../services/connection-hook/connection-hook.service");
let ConfigService = ConfigService_1 = class ConfigService {
    constructor(connectionHookService) {
        this.connectionHookService = connectionHookService;
        this.AMQP_CONFIG = {
            host: process.env.AMQP_HOST || '182.10.0.5',
            port: process.env.AMQP_PORT || 5672
        };
        this.APP_CONFIG = {
            graphiql: process.env.GRAPHIQL === 'true' ? true : false,
            cert: this.cert,
            schema: null,
            uploadFolder: '',
            // tslint:disable-next-line:max-line-length
            port: process.env.API_PORT || process.env.PORT || 9000,
            cyper: {
                iv: 'Jkyt1H3FA8JK9L3A',
                privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lY',
                algorithm: 'aes256',
                key: ''
            },
            connectionHooks: this.connectionHookService,
            ethereumApi: process.env.ETHEREUM_API || 'http://localhost:7545' || 'http://pub-node1.etherscan.io:8545'
        };
        try {
            this.cert = fs_1.readFileSync(process.env.API_CERT || './cert.key');
            this.APP_CONFIG.cert = this.cert;
        }
        catch (e) {
            console.log('This server will be runned without authentication!');
            this.cert = null;
            this.APP_CONFIG.cert = null;
        }
    }
    getApp() {
        return this.APP_CONFIG;
    }
    getAmqp() {
        return this.AMQP_CONFIG;
    }
    setAppConfig(config) {
        this.APP_CONFIG = config;
    }
    static forRoot(config) {
        const configService = Container_1.Container.get(ConfigService_1);
        configService.APP_CONFIG = config.APP_CONFIG;
        configService.AMQP_CONFIG = config.AMQP_CONFIG;
        return ConfigService_1;
    }
};
ConfigService = ConfigService_1 = __decorate([
    index_1.Service(),
    __metadata("design:paramtypes", [connection_hook_service_1.ConnectionHookService])
], ConfigService);
exports.ConfigService = ConfigService;
var ConfigService_1;
