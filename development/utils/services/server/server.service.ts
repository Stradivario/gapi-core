import { Server, ServerOptions, PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
import { graphqlHapi, graphiqlHapi } from '../apollo/apollo.service';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe } from 'graphql/subscription';
import { execute } from 'graphql/execution';
import { attachErrorHandlers, Boom } from '../error/error.service';
import Container, { Service } from '../../../utils/container/index';
import {
  ConfigService,
  AuthService,
  SchemaService,
  ConnectionHookService
} from '../..';
import { GraphQLSchema } from 'graphql';
import { HapiPluginService } from '../plugin/plugin.service';

@Service()
export class ServerUtilService {
  serverConnectionOptions: ServerOptions;
  server: Server;

  async registerEndpoints(endpoints: Array<any>) {
    for (const endpoint of endpoints) {
      await this.server.register(endpoint);
    }
  }

  async initGraphQl(configContainer: ConfigService) {
    const config = Container.get(ConfigService);
    if (process.env.NODE_ENV !== 'production') {
      await this.server.register({
        plugin: graphiqlHapi,
        options: {
          path: '/graphiql',
          graphiqlOptions: {
            endpointURL: '/graphql',
            passHeader: `'Authorization':'${config.APP_CONFIG.graphiqlToken ||
              process.env.GRAPHIQL_TOKEN}'`,
            subscriptionsEndpoint: `${
              process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'
              }://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${
              process.env.DEPLOY_PLATFORM === 'heroku'
                ? ''
                : `:${config.APP_CONFIG.port ||
                process.env.API_PORT ||
                process.env.PORT}`
              }/subscriptions`,
            websocketConnectionParams: {
              token:
                config.APP_CONFIG.graphiqlToken || process.env.GRAPHIQL_TOKEN
            }
          },
        },
      });
    }
    await this.server.register({
      plugin: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: {
          schema: configContainer.APP_CONFIG.schema,
          graphiql: true,
          formatError: attachErrorHandlers
        },
        route: {
          cors: true,
        },
      },
    });
  }

  async connect(options: ConfigService) {
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
    this.server = new Server(this.serverConnectionOptions);

  }

  async startServer() {
    const configContainer = Container.get(ConfigService);
    const connectionHookService = Container.get(ConnectionHookService);
    const userPlugins = Container.get(HapiPluginService);
    await this.connect(configContainer);
    await Promise.all(userPlugins.getPlugins().map(async plugin => await this.server.register(plugin)));
    await this.initGraphQl(configContainer);
    await this.server.start();
    const subscriptionServer = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema: <any>configContainer.APP_CONFIG.schema,
        onConnect(connectionParams) {
          return connectionHookService.modifyHooks
            .onSubConnection(connectionParams);
        },
        onOperation: (connectionParams, params, webSocket) => {
          return connectionHookService.modifyHooks
            .onSubOperation(
              connectionParams,
              params,
              webSocket
            );
        }
      },
      {
        server: this.server.listener,
        path: '/subscriptions'
      }
    );
    console.log(
      `Server running at: http://${this.server.info.address}:${
      this.server.info.port
      }, environment: ${process.env.NODE_ENV || 'development'}`
    );
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `Graphiql dev tool is running at: http://${
        this.server.info.address
        }:${this.server.info.port}/graphiql`
      );
    }
    return await Promise.resolve(this.server);
  }

  stopServer() {
    return this.server.stop();
  }
}

function exitHandler(options, err) {
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) {
    Container.get(ServerUtilService)
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
