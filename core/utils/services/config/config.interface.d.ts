/// <reference types="node" />
import { GraphQLSchema } from "graphql";
import { ConnectionHookService } from "../../services/connection-hook/connection-hook.service";
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
    fakeUsers?: boolean;
    force?: boolean;
    schema?: GraphQLSchema;
    cyper?: any;
    connectionHooks?: ConnectionHookService;
    ethereumApi?: string;
}
export interface SequelizeConfigInterface {
    development?: {
        dialect?: string;
        host?: string;
        port?: string;
        username?: string;
        password?: string;
        name?: string;
        logging?: boolean;
        storage?: string;
        modelPaths?: string[];
    };
    testing: {
        dialect?: string;
        host?: string;
        port?: string;
        username?: string;
        password?: string;
        name?: string;
        storage?: string;
        logging?: boolean;
        modelPaths?: string[];
    };
}
