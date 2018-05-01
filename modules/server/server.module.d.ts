import { AppConfigInterface } from '../../utils/services/config/config.interface';
import { GraphQLSchema } from 'graphql';
import { Server } from 'hapi';
export interface Config {
    port: string;
    cert: any;
    schema: GraphQLSchema;
}
export declare class GapiServerModule {
    hapiServer: Server;
    start(): Promise<boolean>;
    static forRoot(config: AppConfigInterface): typeof GapiServerModule;
    stop(): Promise<void>;
}
