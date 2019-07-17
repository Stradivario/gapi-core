"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var CoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = require("@rxdi/hapi");
const graphql_1 = require("@rxdi/graphql");
const graphql_pubsub_1 = require("@rxdi/graphql-pubsub");
const core_1 = require("@rxdi/core");
const daemon_1 = require("@gapi/daemon");
const DEFAULT_CONFIG = {
    server: {
        hapi: {
            port: 9000
        },
    },
    graphql: {
        path: '/graphql',
        initQuery: true,
        openBrowser: true,
        writeEffects: false,
        graphiql: false,
        graphiQlPlayground: true,
        graphiQlPath: '/',
        watcherPort: '',
        graphiqlOptions: {
            endpointURL: '/graphql',
            subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${process.env.DEPLOY_PLATFORM === 'heroku'
                ? ''
                : `:${process.env.API_PORT ||
                    process.env.PORT || 9000}`}/subscriptions`,
            websocketConnectionParams: {
                token: process.env.GRAPHIQL_TOKEN
            }
        },
        graphqlOptions: {
            schema: null
        }
    },
    daemon: {
        activated: false
    }
};
let CoreModule = CoreModule_1 = class CoreModule {
    static forRoot(config) {
        config = config || DEFAULT_CONFIG;
        return {
            module: CoreModule_1,
            frameworkImports: [
                hapi_1.HapiModule.forRoot(Object.assign({}, DEFAULT_CONFIG.server, config.server)),
                graphql_1.GraphQLModule.forRoot(Object.assign({}, DEFAULT_CONFIG.graphql, config.graphql)),
                graphql_pubsub_1.GraphQLPubSubModule.forRoot(config.pubsub),
                daemon_1.DaemonModule.forRoot(config.daemon)
            ]
        };
    }
};
CoreModule = CoreModule_1 = __decorate([
    core_1.Module()
], CoreModule);
exports.CoreModule = CoreModule;
__export(require("graphql"));
__export(require("graphql-tools"));
__export(require("graphql-geojson"));
__export(require("graphql-subscriptions"));
__export(require("@rxdi/graphql-pubsub"));
__export(require("@rxdi/graphql"));
__export(require("@rxdi/hapi"));
__export(require("@rxdi/core"));
