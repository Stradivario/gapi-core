/// <reference types="node" />
import { GraphQLSchema } from 'graphql';
import { ConnectionHookService } from '../../services/connection-hook/connection-hook.service';
export interface AmqpConfigInterface {
    host: string;
    port: string | number;
}
export interface AppConfigInterface {
    graphiql?: boolean;
    cert?: Buffer;
    uploadFolder?: string;
    graphiqlToken?: string;
    port: string | number;
    force?: boolean;
    schema?: GraphQLSchema;
    cyper?: any;
    connectionHooks?: ConnectionHookService;
    ethereumApi?: string;
}
