"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const graphql_1 = require("graphql");
const controller_service_1 = require("../../new_services/controller-service/controller.service");
const schema_service_1 = require("../../services/schema/schema.service");
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
    syncSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const test = typedi_1.default.get(controller_service_1.ControllerContainerService);
            const ticketCtrl = test.getController('TicketController');
            let QueryFields = {};
            Array.from(ticketCtrl._queries.keys()).forEach((key) => Object.assign(QueryFields, { [key]: ticketCtrl.getQuery(key) }));
            const Query = new graphql_1.GraphQLObjectType({
                name: 'Query',
                description: 'Query type for all get requests which will not change persistent data',
                fields: Object.assign({}, QueryFields)
            });
            const Mutation = new graphql_1.GraphQLObjectType({
                name: 'Mutation',
                description: 'Mutation type for all requests which will change persistent data',
                fields: {}
            });
            const Subscription = new graphql_1.GraphQLObjectType({
                name: 'Subscription',
                description: 'Subscription type for all rabbitmq subscriptions via pub sub',
                fields: {}
            });
            const schemaService = typedi_1.default.get(schema_service_1.SchemaService);
            const schema = schemaService.generateSchema(Query);
            this.APP_CONFIG.schema = schema;
            return Promise.resolve();
        });
    }
};
ConfigService = __decorate([
    typedi_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;
