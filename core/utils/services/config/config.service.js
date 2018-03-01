"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../core/utils/container/index");
let ConfigService = class ConfigService {
    constructor() {
        this.SEQUELIZE_CONFIG = {
            development: {
                dialect: 'postgres',
                host: process.env.DB_HOST || '172.10.0.10',
                port: process.env.DB_PORT || '5432',
                username: process.env.DB_USERNAME || 'dbuser',
                password: process.env.DB_PASSWORD || 'dbuserpass',
                name: process.env.DB_NAME || 'antitheft',
                logging: false,
                storage: ':memory:',
                modelPaths: [__dirname + '/graphql/core/models']
            },
            testing: {
                dialect: 'postgres',
                host: process.env.DB_HOST || '172.10.0.10',
                port: process.env.DB_PORT || '5432',
                username: process.env.DB_USERNAME || 'dbuser',
                password: process.env.DB_PASSWORD || 'dbuserpass',
                name: process.env.DB_NAME || 'testing',
                storage: ':memory:',
                logging: false,
                modelPaths: [__dirname + '/graphql/core/models']
            },
        };
        this.AMQP_CONFIG = {
            host: process.env.AMQP_HOST || '172.10.0.4',
            port: process.env.AMQP_PORT || 5672
        };
        this.APP_CONFIG = {
            cert: new Buffer(1),
            schema: null,
            uploadFolder: '/home/rampage/Desktop/testUploadDir',
            // tslint:disable-next-line:max-line-length
            graphiqlToken: process.env.GRAPHIQL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2NjQ1NDMwfQ.NtCild_BQozDUWM-4f2Q94YrKLGUzaELv_rfQcnDVTA',
            port: process.env.API_PORT || 8200,
            fakeUsers: true,
            force: true,
            cyper: {
                iv: 'JkYt1H3fA8JK9L3G',
                privateKey: '8zTVzr3p53VC12jmV54rIYu2545x47lY',
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
};
ConfigService = __decorate([
    index_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;
