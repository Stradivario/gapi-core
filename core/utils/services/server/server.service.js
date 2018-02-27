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
// import { Credential } from './models/Credential';
const error_service_1 = require("../error/error.service");
const typedi_1 = require("typedi");
const __1 = require("../..");
let ServerUtilService = class ServerUtilService {
    constructor() {
        this.server = new hapi_1.Server();
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // const userInfo = Container.get(AuthModule).verifyToken(token);
            // let credential: Credential;
            return { id: 1, user: { id: 1, type: 'ADMIN' } };
            // if (userInfo) {
            //   try {
            // credential = await Credential.find(<any>{
            //   where: {
            //     email: userInfo.email
            //   },
            //   include: [{
            //     association: 'user',
            //     include: [{association: 'wallet', include: ['transaction']}]
            //   }]
            // });
            //   } catch (e) {
            //     throw Boom.unauthorized();
            //   }
            //   if (credential) {
            // return credential;
            //   } else {
            // throw Boom.unauthorized();
            //   }
            // } else {
            //   throw Boom.unauthorized();
            // }
        });
    }
    //noinspection TypeScriptUnresolvedFunction
    registerEndpoints(endpoints) {
        for (const endpoint of endpoints) {
            this.server.register(endpoint);
        }
    }
    initGraphQl() {
        const config = typedi_1.default.get(__1.ConfigService);
        const graphqlOptions = {
            register: apollo_service_1.graphqlHapi,
            options: {
                path: '/graphql',
                graphqlOptions: {
                    schema: config.APP_CONFIG.schema,
                    graphiql: true,
                    formatError: error_service_1.attachErrorHandlers
                    // context: {},
                }
            }
        };
        if (process.env.NODE_ENV !== 'production') {
            this.registerEndpoints([{
                    register: apollo_service_1.graphiqlHapi,
                    options: {
                        path: '/graphiql',
                        graphiqlOptions: {
                            endpointURL: '/graphql',
                            passHeader: `'Authorization':'${config.APP_CONFIG.graphiqlToken}'`,
                            subscriptionsEndpoint: `ws://localhost:${config.APP_CONFIG.port}/subscriptions`,
                        },
                    },
                }]);
        }
        // this.registerEndpoints([{
        //   method: 'POST',
        //   path: '/upload',
        //   config: {
        //     payload: {
        //       maxBytes: 2048576000000,
        //       output: 'stream',
        //       parse: true,
        //       allow: 'multipart/form-data'
        //     },
        //     app: {
        //       tags: ['api', 'shop'],
        //       description: 'uploadFile',
        //       endpoint: 'uploadFile',
        //       scope: [
        //         ENUMS.USER_TYPE.ADMIN.key
        //       ]
        //     },
        //     auth: false,
        //     handler: uploadFile,
        //   }
        // }]);
        this.registerEndpoints([graphqlOptions]);
    }
    connect(options) {
        const serverConnectionOptions = {
            port: options.port,
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
        // if(process.env.NODE_ENV === 'production') {
        //   serverConnectionOptions.tls = {
        //     key: key,
        //     cert:cert
        //   };
        // }
        this.server.connection(serverConnectionOptions);
        this.onRequest();
    }
    onRequest() {
        // this.ext('onRequest', function (request, reply) {
        //   // if(request.method === 'options') {
        //     return reply.continue();
        //   // }
        //   // if(!request.headers.authorization) {
        //   //   return reply(Boom.unauthorized());
        //   // } else {
        //   //   ServerModule.validateToken(request.headers.authorization);
        //   //   return reply.continue();
        //   // }
        // });
    }
    startServer() {
        this.connect(typedi_1.default.get(__1.ConfigService).APP_CONFIG);
        this.initGraphQl();
        const self = this;
        return new Promise((resolve, reject) => {
            this.server.start((err) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                const subscriptionServer = new subscriptions_transport_ws_1.SubscriptionServer({
                    execute: execution_1.execute,
                    subscribe: subscription_1.subscribe,
                    schema: typedi_1.default.get(__1.ConfigService).APP_CONFIG.schema,
                    onConnect(connectionParams) {
                        // if (connectionParams.token) {
                        return { id: 1, userId: 1, user: { id: 1, type: 'ADMIN' } };
                        // } else {
                        // throw Boom.unauthorized();
                        // }
                    },
                    onOperation: (message, params, webSocket) => {
                        return params;
                    },
                }, {
                    server: this.server.listener,
                    path: '/subscriptions',
                });
                console.log(`Server running at: ${this.server.info.uri}, environment: ${process.env.NODE_ENV}`);
                resolve(true);
            });
        });
    }
};
ServerUtilService = __decorate([
    typedi_1.Service()
], ServerUtilService);
exports.ServerUtilService = ServerUtilService;
