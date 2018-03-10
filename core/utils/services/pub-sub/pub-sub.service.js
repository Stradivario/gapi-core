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
const graphql_subscriptions_1 = require("graphql-subscriptions");
const graphql_rabbitmq_subscriptions_1 = require("graphql-rabbitmq-subscriptions");
const lib_1 = require("@cdm-logger/server/lib");
const index_1 = require("../../container/index");
const config_service_1 = require("../config/config.service");
const logger = lib_1.ConsoleLogger.create('<app name>', {
    level: 'info',
    mode: 'raw' // Optional: default 'short' ('short'|'long'|'dev'|'raw')
});
let GapiPubSubService = class GapiPubSubService {
    constructor(pubSub, configService) {
        this.pubSub = pubSub;
        this.configService = configService;
        if (pubSub) {
            this.sub = pubSub;
        }
        else if (process.env.NODE_ENV === 'production') {
            this.sub = new graphql_rabbitmq_subscriptions_1.AmqpPubSub({
                config: {
                    host: process.env.AMQP_HOST || this.configService.AMQP_CONFIG.host,
                    port: process.env.AMQP_PORT || this.configService.AMQP_CONFIG.port,
                },
                logger,
            });
        }
        else {
            this.sub = new graphql_subscriptions_1.PubSub();
        }
    }
    asyncIterator(event) {
        return this.sub.asyncIterator(event);
    }
    publish(signal, data) {
        return this.sub.publish(signal, data);
    }
};
GapiPubSubService = __decorate([
    index_1.Service(),
    __metadata("design:paramtypes", [Object, config_service_1.ConfigService])
], GapiPubSubService);
exports.GapiPubSubService = GapiPubSubService;
