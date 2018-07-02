import { HapiModule, HapiConfigInterface } from '@rxdi/hapi';
import { GraphQLModule, GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import { GraphQLPubSubModule, GRAPHQL_PUB_SUB_DI_CONFIG } from '@rxdi/graphql-pubsub';
import { ModuleWithServices, Module } from '@rxdi/core';

export interface CoreModuleConfig {
    server?: HapiConfigInterface;
    graphql?: GRAPHQL_PLUGIN_CONFIG;
    pubsub?: GRAPHQL_PUB_SUB_DI_CONFIG;
}

const DEFAULT_CONFIG = {
    server: {
        hapi: {
            port: 9000
        }
    },
    graphql: {
        path: '/graphql',
        openBrowser: false,
        writeEffects: false,
        graphiQlPath: '/graphiql',
        graphiqlOptions: {
            endpointURL: '/graphql',
            subscriptionsEndpoint: `${
                process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'
                }://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${
                process.env.DEPLOY_PLATFORM === 'heroku'
                    ? ''
                    : `:${process.env.API_PORT ||
                    process.env.PORT}`
                }/subscriptions`,
            websocketConnectionParams: {
                token: process.env.GRAPHIQL_TOKEN
            }
        },
        graphqlOptions: {
            schema: null
        }
    },
};

@Module({
    imports: [
        HapiModule.forRoot(DEFAULT_CONFIG.server),
        GraphQLModule.forRoot(DEFAULT_CONFIG.graphql),
        GraphQLPubSubModule.forRoot()
    ]
})
export class CoreModule {
    public static forRoot(config?: CoreModuleConfig): ModuleWithServices {
        config = config || DEFAULT_CONFIG;
        return {
            module: CoreModule,
            frameworkImports: [
                HapiModule.forRoot(config.server),
                GraphQLModule.forRoot(config.graphql),
                GraphQLPubSubModule.forRoot(config.pubsub)
            ]
        }
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
