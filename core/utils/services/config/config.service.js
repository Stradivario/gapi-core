"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../core/utils/container/index");
const Container_1 = require("../../container/Container");
let ConfigService = ConfigService_1 = class ConfigService {
    constructor() {
        this.SEQUELIZE_CONFIG = {
            development: {
                dialect: 'postgres',
                host: process.env.DB_HOST || '172.10.0.10',
                port: process.env.DB_PORT || '5432',
                username: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                name: process.env.DB_NAME || '',
                logging: false,
                storage: ':memory:',
                modelPaths: [__dirname + '/graphql/core/models']
            },
            testing: {
                dialect: 'postgres',
                host: process.env.DB_HOST || '172.10.0.180',
                port: process.env.DB_PORT || '5432',
                username: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                name: process.env.DB_NAME || 'testing',
                storage: ':memory:',
                logging: false,
                modelPaths: [__dirname + '/graphql/core/models']
            },
        };
        this.AMQP_CONFIG = {
            host: process.env.AMQP_HOST || '172.10.0.181',
            port: process.env.AMQP_PORT || 5672
        };
        this.APP_CONFIG = {
            cert: new Buffer(1),
            schema: null,
            uploadFolder: '',
            // tslint:disable-next-line:max-line-length
            graphiqlToken: process.env.GRAPHIQL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2NjQ1NDMwfQ.NtCild_BQozDUWM-4f2Q94YrKLGUzaELv_rfQcnDVTA',
            port: process.env.API_PORT || 8200,
            fakeUsers: true,
            force: true,
            cyper: {
                iv: 'Jkyt1H3FA8JK9L3A',
                privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lY',
                algorithm: 'aes256',
                key: ''
            },
            ethereumApi: process.env.ETHEREUM_API || 'http://localhost:7545' || 'http://pub-node1.etherscan.io:8545'
        };
    }
    getApp() {
        return this.APP_CONFIG;
    }
    getSequelize() {
        return this.SEQUELIZE_CONFIG;
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
        configService.SEQUELIZE_CONFIG = config.SEQUELIZE_CONFIG;
        return ConfigService_1;
    }
};
ConfigService = ConfigService_1 = __decorate([
    index_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;
var ConfigService_1;
