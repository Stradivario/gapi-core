import { HapiModule, HapiConfigModel } from '@rxdi/hapi';
import { GraphQLModule, GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import {
  GraphQLPubSubModule,
  GRAPHQL_PUB_SUB_DI_CONFIG
} from '@rxdi/graphql-pubsub';
import { ModuleWithServices, Module } from '@rxdi/core';
import { DaemonModule, DaemonConfig } from '@gapi/daemon';

export interface CoreModuleConfig {
  server?: HapiConfigModel;
  graphql?: GRAPHQL_PLUGIN_CONFIG;
  pubsub?: GRAPHQL_PUB_SUB_DI_CONFIG;
  daemon?: DaemonConfig;
}

const DEFAULT_CONFIG: CoreModuleConfig = {
  server: {
    hapi: {
      port: 9000
    }
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
      subscriptionsEndpoint: `${
        process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'
      }://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${
        process.env.DEPLOY_PLATFORM === 'heroku'
          ? ''
          : `:${process.env.API_PORT || process.env.PORT || 9000}`
      }/subscriptions`,
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

@Module()
export class CoreModule {
  public static forRoot(config?: CoreModuleConfig): ModuleWithServices {
    config = config || DEFAULT_CONFIG;
    return {
      module: CoreModule,
      frameworkImports: [
        HapiModule.forRoot({ ...DEFAULT_CONFIG.server, ...config.server }),
        GraphQLModule.forRoot({ ...DEFAULT_CONFIG.graphql, ...config.graphql }),
        GraphQLPubSubModule.forRoot(config.pubsub),
        DaemonModule.forRoot(config.daemon)
      ]
    };
  }
}

export * from 'graphql';
export * from 'graphql-tools';
export * from 'graphql-geojson';
export * from 'graphql-subscriptions';
export * from '@rxdi/graphql-pubsub';
export * from '@rxdi/graphql';
export * from '@rxdi/hapi';
export * from '@rxdi/core';
