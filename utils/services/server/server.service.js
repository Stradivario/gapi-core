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
const hapi_1 = require("hapi");
const apollo_service_1 = require("../apollo/apollo.service");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const subscription_1 = require("graphql/subscription");
const execution_1 = require("graphql/execution");
const error_service_1 = require("../error/error.service");
const index_1 = require("../../../utils/container/index");
const __1 = require("../..");
const plugin_service_1 = require("../plugin/plugin.service");
let ServerUtilService = class ServerUtilService {
    registerEndpoints(endpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const endpoint of endpoints) {
                yield this.server.register(endpoint);
            }
        });
    }
    initGraphQl(configContainer) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = index_1.default.get(__1.ConfigService);
            if (process.env.NODE_ENV !== 'production') {
                yield this.server.register({
                    plugin: apollo_service_1.graphiqlHapi,
                    options: {
                        path: '/graphiql',
                        graphiqlOptions: {
                            endpointURL: '/graphql',
                            passHeader: `'Authorization':'${config.APP_CONFIG.graphiqlToken ||
                                process.env.GRAPHIQL_TOKEN}'`,
                            subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${process.env.DEPLOY_PLATFORM === 'heroku'
                                ? ''
                                : `${process.env.WS_NO_PORT ? '' : `:${config.APP_CONFIG.port ||
                                    process.env.API_PORT ||
                                    process.env.PORT}`}`}/subscriptions`,
                            websocketConnectionParams: {
                                token: config.APP_CONFIG.graphiqlToken || process.env.GRAPHIQL_TOKEN
                            }
                        },
                    },
                });
            }
            yield this.server.register({
                plugin: apollo_service_1.graphqlHapi,
                options: {
                    path: '/graphql',
                    graphqlOptions: {
                        schema: configContainer.APP_CONFIG.schema,
                        graphiql: true,
                        formatError: error_service_1.attachErrorHandlers
                    },
                    route: {
                        cors: true,
                    },
                },
            });
        });
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.serverConnectionOptions = {
                port: options.APP_CONFIG.port,
                routes: {
                    cors: {
                        origin: ['*'],
                        additionalHeaders: [
                            'Host',
                            'User-Agent',
                            'Accept',
                            'Accept-Language',
                            'Accept-Encoding',
                            'Access-Control-Request-Method',
                            'Access-Control-Request-Headers',
                            'Origin',
                            'Connection',
                            'Pragma',
                            'Cache-Control'
                        ]
                    }
                }
            };
            this.server = new hapi_1.Server(this.serverConnectionOptions);
        });
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const configContainer = index_1.default.get(__1.ConfigService);
            const connectionHookService = index_1.default.get(__1.ConnectionHookService);
            const userPlugins = index_1.default.get(plugin_service_1.HapiPluginService);
            yield this.connect(configContainer);
            yield Promise.all(userPlugins.getPlugins().map((plugin) => __awaiter(this, void 0, void 0, function* () { return yield this.server.register(plugin); })));
            yield this.initGraphQl(configContainer);
            yield this.server.start();
            const subscriptionServer = new subscriptions_transport_ws_1.SubscriptionServer({
                execute: execution_1.execute,
                subscribe: subscription_1.subscribe,
                schema: configContainer.APP_CONFIG.schema,
                onConnect(connectionParams) {
                    return connectionHookService.modifyHooks
                        .onSubConnection(connectionParams);
                },
                onOperation: (connectionParams, params, webSocket) => {
                    return connectionHookService.modifyHooks
                        .onSubOperation(connectionParams, params, webSocket);
                }
            }, {
                server: this.server.listener,
                path: '/subscriptions'
            });
            console.log(`Server running at: http://${this.server.info.address}:${this.server.info.port}/graphql, environment: ${process.env.NODE_ENV || 'development'}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Graphiql dev tool is running at: http://${this.server.info.address}:${this.server.info.port}/graphiql`);
            }
            return yield Promise.resolve(this.server);
        });
    }
    stopServer() {
        if (this.server) {
            return this.server.stop();
        }
        else {
            return Promise.resolve();
        }
    }
};
ServerUtilService = __decorate([
    index_1.Service()
], ServerUtilService);
exports.ServerUtilService = ServerUtilService;
function exitHandler(options, err) {
    if (options.cleanup)
        console.log('clean');
    if (err)
        console.log(err.stack);
    if (options.exit) {
        index_1.default.get(ServerUtilService)
            .stopServer()
            .then(() => process.exit());
    }
}
// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catches 'kill pid' (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
