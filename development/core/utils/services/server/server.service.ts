import { Server, ServerConnectionOptions } from 'hapi';
import { graphqlHapi, graphiqlHapi } from '../apollo/apollo.service';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe } from 'graphql/subscription';
import { execute } from 'graphql/execution';
// import { Credential } from './models/Credential';

import { attachErrorHandlers, Boom } from '../error/error.service';
import Container, {Service} from '../../../utils/container/index';
import { ConfigService, AuthModule, SequelizeService, SchemaService } from '../..';
import { GraphQLSchema } from 'graphql';
import { ConfigFactory } from '../../..';

@Service()
export class ServerUtilService {
    server: Server = new Server();
    async validateToken(token: string) {
        // const userInfo = Container.get(AuthModule).verifyToken(token);
        // let credential: Credential;
        return {id: 1, user: {id: 1, type: 'ADMIN'}};
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
    }

    //noinspection TypeScriptUnresolvedFunction
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
                    formatError: attachErrorHandlers
                    // context: {},
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
        this.connect(Container.get(ConfigService).APP_CONFIG);
        this.initGraphQl();
        const self = this;
        return new Promise((resolve, reject) => {
            this.server.start((err) => {
                if (err) {
                    reject(err);
                    throw err;
                }
   
                const subscriptionServer = new SubscriptionServer(<any>{
                    execute,
                    subscribe,
                    schema: Container.get(ConfigService).APP_CONFIG.schema,
                    onConnect(connectionParams) {
                        // if (connectionParams.token) {
                            return {id: 1, userId: 1, user: {id: 1, type: 'ADMIN'}};
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

    stopServer() {
        this.server.stop();
    }
}
