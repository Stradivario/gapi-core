import { Server, ServerConnectionOptions } from 'hapi';
import { graphqlHapi, graphiqlHapi } from '../apollo/apollo.service';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe } from 'graphql/subscription';
import { execute } from 'graphql/execution';
// import { Credential } from './models/Credential';

import { attachErrorHandlers, Boom } from '../error/error.service';
import Container, { Service } from '../../../utils/container/index';
import { ConfigService, AuthService, SchemaService, ConnectionHookService } from '../..';
import { GraphQLSchema } from 'graphql';

@Service()
export class ServerUtilService {
    server: Server = new Server();

    registerEndpoints(endpoints: Array<any>) {
        for (const endpoint of endpoints) {
            this.server.register(endpoint);
        }
    }

    async initGraphQl() {
        const config = Container.get(ConfigService);
        const graphqlOptions = {
            register: graphqlHapi,
            options: {
                path: '/graphql',
                graphqlOptions: {
                    schema: config.APP_CONFIG.schema,
                    graphiql: true,
                    formatError: attachErrorHandlers,
                }
            }
        };

        if (process.env.NODE_ENV !== 'production') {
            this.registerEndpoints([{
                register: graphiqlHapi,
                options: {
                    path: '/graphiql',
                    graphiqlOptions: {
                        endpointURL: '/graphql',
                        passHeader: `'Authorization':'${config.APP_CONFIG.graphiqlToken || process.env.GRAPHIQL_TOKEN}'`,
                        subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${process.env.DEPLOY_PLATFORM === 'heroku' ? '' : `:${config.APP_CONFIG.port || process.env.API_PORT || process.env.PORT}`}/subscriptions`,
                        websocketConnectionParams: {
                            token: config.APP_CONFIG.graphiqlToken || process.env.GRAPHIQL_TOKEN
                        }
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
        const serverConnectionOptions = <ServerConnectionOptions>{
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
        // this.server.ext('onRequest', function (request, reply) {
        //   // if(request.method === 'options') {
        //       console.log('1441')
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
        const configContainer = Container.get(ConfigService);
        this.connect(configContainer.APP_CONFIG);
        this.initGraphQl();
        const self = this;
        const connectionHookService = Container.get(ConnectionHookService)
        return new Promise((resolve, reject) => {
            this.server.start((err) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                const subscriptionServer = new SubscriptionServer(<any>{
                    execute,
                    subscribe,
                    schema: configContainer.APP_CONFIG.schema,
                    onConnect(connectionParams) {
                        return connectionHookService.modifyHooks.onSubConnection(connectionParams);
                    },
                    onOperation: (message, params, webSocket) => {
                        return connectionHookService.modifyHooks.onSubOperation(message, params, webSocket);
                    },
                }, {
                        server: this.server.listener,
                        path: '/subscriptions',
                    });
                console.log(`Server running at: http://${this.server.info.address}:${this.server.info.port}, environment: ${process.env.NODE_ENV || 'development'}`);
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`Graphiql dev tool is running at: http://${this.server.info.address}:${this.server.info.port}/graphiql`);
                }
                resolve(true);
            });
        });
    }

    stopServer() {
        return this.server.stop();
    }
}




function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) {
        Container.get(ServerUtilService).stopServer()
            .then(() => process.exit());
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));