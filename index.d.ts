import { HapiConfigInterface } from '@rxdi/hapi';
import { GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import { GRAPHQL_PUB_SUB_DI_CONFIG } from '@rxdi/graphql-pubsub';
import { ModuleWithServices } from '@rxdi/core';
export interface CoreModuleConfig {
    hapi?: HapiConfigInterface;
    graphql?: GRAPHQL_PLUGIN_CONFIG;
    pubsub?: GRAPHQL_PUB_SUB_DI_CONFIG;
}
export declare class CoreModule {
    static forRoot(config?: CoreModuleConfig): ModuleWithServices;
}
export * from 'graphql';
export * from 'graphql-geojson';
export * from 'graphql-subscriptions';
export * from '@rxdi/graphql-pubsub';
export * from '@rxdi/graphql';
export * from '@rxdi/hapi';
